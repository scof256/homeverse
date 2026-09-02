create extension if not exists pgcrypto;

create type public.user_role as enum ('customer', 'agent', 'admin');
create type public.listing_status as enum ('draft', 'pending', 'published', 'rejected', 'archived');
create type public.listing_purpose as enum ('rent', 'sale');
create type public.inquiry_status as enum ('new', 'contacted', 'closed');
create type public.appointment_status as enum ('requested', 'confirmed', 'completed', 'cancelled');

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  phone text,
  avatar_url text,
  bio text,
  agency_name text,
  license_number text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.profiles(id) on delete restrict,
  slug text not null unique,
  title text not null check (char_length(title) between 5 and 140),
  description text not null check (char_length(description) between 30 and 5000),
  purpose public.listing_purpose not null,
  property_type text not null,
  price numeric(14,2) not null check (price >= 0),
  currency char(3) not null default 'USD',
  country text not null,
  city text not null,
  address text not null,
  latitude numeric(9,6),
  longitude numeric(9,6),
  bedrooms smallint not null default 0 check (bedrooms >= 0),
  bathrooms smallint not null default 0 check (bathrooms >= 0),
  area_sqft integer not null check (area_sqft > 0),
  year_built smallint,
  amenities text[] not null default '{}',
  status public.listing_status not null default 'draft',
  featured boolean not null default false,
  verified boolean not null default false,
  rejection_reason text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.property_media (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  storage_path text not null,
  alt_text text not null default '',
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  unique(property_id, storage_path)
);

create table public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, property_id)
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  agent_id uuid not null references public.profiles(id) on delete cascade,
  message text not null check (char_length(message) between 10 and 2000),
  status public.inquiry_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  agent_id uuid not null references public.profiles(id) on delete cascade,
  scheduled_at timestamptz not null,
  note text check (char_length(note) <= 1000),
  status public.appointment_status not null default 'requested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  entity_type text not null,
  entity_id text not null,
  action text not null,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create index properties_agent_idx on public.properties(agent_id);
create index properties_search_idx on public.properties(city, purpose, property_type, price);
create index properties_published_idx on public.properties(published_at desc) where status = 'published';
create index properties_amenities_idx on public.properties using gin(amenities);
create index property_media_property_idx on public.property_media(property_id, sort_order);
create index favorites_property_idx on public.favorites(property_id);
create index inquiries_property_idx on public.inquiries(property_id);
create index inquiries_customer_idx on public.inquiries(customer_id, created_at desc);
create index inquiries_agent_idx on public.inquiries(agent_id, status, created_at desc);
create index appointments_property_idx on public.appointments(property_id);
create index appointments_customer_idx on public.appointments(customer_id, scheduled_at);
create index appointments_agent_idx on public.appointments(agent_id, status, scheduled_at);
create index audit_logs_actor_idx on public.audit_logs(actor_id, created_at desc);

create function private.is_admin(user_id uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = user_id and role = 'admin');
$$;

create function private.is_agent_or_admin(user_id uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = user_id and role in ('agent', 'admin'));
$$;

grant usage on schema private to authenticated;
grant execute on function private.is_admin(uuid), private.is_agent_or_admin(uuid) to authenticated;

create function private.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;

create function private.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id, email, full_name, role)
  values (new.id, coalesce(new.email, ''), coalesce(new.raw_user_meta_data ->> 'full_name', ''), 'customer');
  return new;
end;
$$;

create function private.protect_profile_role() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if old.role is distinct from new.role and auth.uid() is not null and not private.is_admin(auth.uid()) then
    raise exception 'Only administrators can change roles';
  end if;
  if old.email is distinct from new.email and auth.uid() is not null and not private.is_admin(auth.uid()) then
    raise exception 'Email is managed by the authentication service';
  end if;
  return new;
end;
$$;

create function private.validate_property_write() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is not null and not private.is_admin(auth.uid()) then
    if tg_op = 'INSERT' then
      new.agent_id = auth.uid(); new.featured = false; new.verified = false;
      if new.status not in ('draft', 'pending') then new.status = 'draft'; end if;
    else
      new.agent_id = old.agent_id; new.featured = old.featured; new.verified = old.verified;
      if new.status not in ('draft', 'pending', 'archived') then new.status = old.status; end if;
    end if;
  end if;
  if new.status = 'published' and (tg_op = 'INSERT' or old.status is distinct from 'published') then new.published_at = now(); end if;
  return new;
end;
$$;

create function private.guard_inquiry_update() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if not private.is_admin(auth.uid()) then
    new.property_id = old.property_id;
    new.customer_id = old.customer_id;
    new.agent_id = old.agent_id;
    new.message = old.message;
  end if;
  return new;
end;
$$;

create function private.guard_appointment_update() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if not private.is_admin(auth.uid()) then
    new.property_id = old.property_id;
    new.customer_id = old.customer_id;
    new.agent_id = old.agent_id;
    if auth.uid() = old.customer_id and new.status not in ('requested', 'cancelled') then new.status = old.status; end if;
  end if;
  return new;
end;
$$;

create function private.audit_change() returns trigger
language plpgsql security definer set search_path = '' as $$
declare row_id text;
begin
  row_id = coalesce(to_jsonb(new) ->> 'id', to_jsonb(old) ->> 'id', 'unknown');
  insert into public.audit_logs(actor_id, entity_type, entity_id, action, old_data, new_data)
  values (auth.uid(), tg_table_name, row_id, tg_op, case when tg_op = 'INSERT' then null else to_jsonb(old) end, case when tg_op = 'DELETE' then null else to_jsonb(new) end);
  return coalesce(new, old);
end;
$$;

create function private.validate_inquiry() returns trigger
language plpgsql security definer set search_path = '' as $$
declare listing_agent uuid; recent_count integer;
begin
  select agent_id into listing_agent from public.properties where id = new.property_id and status = 'published';
  if listing_agent is null then raise exception 'Listing is unavailable'; end if;
  new.customer_id = auth.uid(); new.agent_id = listing_agent; new.status = 'new';
  select count(*) into recent_count from public.inquiries where customer_id = auth.uid() and created_at > now() - interval '15 minutes';
  if recent_count >= 5 then raise exception 'Inquiry rate limit reached'; end if;
  return new;
end;
$$;

create function private.validate_appointment() returns trigger
language plpgsql security definer set search_path = '' as $$
declare listing_agent uuid; recent_count integer;
begin
  select agent_id into listing_agent from public.properties where id = new.property_id and status = 'published';
  if listing_agent is null then raise exception 'Listing is unavailable'; end if;
  if new.scheduled_at < now() + interval '2 hours' then raise exception 'Viewing must be scheduled at least two hours ahead'; end if;
  new.customer_id = auth.uid(); new.agent_id = listing_agent; new.status = 'requested';
  select count(*) into recent_count from public.appointments where customer_id = auth.uid() and created_at > now() - interval '1 day';
  if recent_count >= 5 then raise exception 'Appointment rate limit reached'; end if;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute function private.handle_new_user();
create trigger profiles_updated before update on public.profiles for each row execute function private.set_updated_at();
create trigger profiles_role_guard before update on public.profiles for each row execute function private.protect_profile_role();
create trigger properties_updated before update on public.properties for each row execute function private.set_updated_at();
create trigger properties_write_guard before insert or update on public.properties for each row execute function private.validate_property_write();
create trigger inquiries_updated before update on public.inquiries for each row execute function private.set_updated_at();
create trigger inquiries_update_guard before update on public.inquiries for each row execute function private.guard_inquiry_update();
create trigger inquiries_validate before insert on public.inquiries for each row execute function private.validate_inquiry();
create trigger appointments_updated before update on public.appointments for each row execute function private.set_updated_at();
create trigger appointments_update_guard before update on public.appointments for each row execute function private.guard_appointment_update();
create trigger appointments_validate before insert on public.appointments for each row execute function private.validate_appointment();
create trigger profiles_audit after update on public.profiles for each row execute function private.audit_change();
create trigger properties_audit after insert or update or delete on public.properties for each row execute function private.audit_change();
create trigger inquiries_audit after insert or update on public.inquiries for each row execute function private.audit_change();
create trigger appointments_audit after insert or update on public.appointments for each row execute function private.audit_change();

alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.property_media enable row level security;
alter table public.favorites enable row level security;
alter table public.inquiries enable row level security;
alter table public.appointments enable row level security;
alter table public.audit_logs enable row level security;

create policy profiles_select on public.profiles for select using (id = (select auth.uid()) or role = 'agent' or private.is_admin());
create policy profiles_update_self on public.profiles for update using (id = (select auth.uid()) or private.is_admin()) with check (id = (select auth.uid()) or private.is_admin());

create policy properties_select on public.properties for select using (status = 'published' or agent_id = (select auth.uid()) or private.is_admin());
create policy properties_insert on public.properties for insert to authenticated with check (agent_id = (select auth.uid()) and private.is_agent_or_admin());
create policy properties_update on public.properties for update to authenticated using (agent_id = (select auth.uid()) or private.is_admin()) with check (agent_id = (select auth.uid()) or private.is_admin());
create policy properties_delete on public.properties for delete to authenticated using ((agent_id = (select auth.uid()) and status = 'draft') or private.is_admin());

create policy media_select on public.property_media for select using (exists(select 1 from public.properties p where p.id = property_id and (p.status = 'published' or p.agent_id = (select auth.uid()) or private.is_admin())));
create policy media_write on public.property_media for all to authenticated using (exists(select 1 from public.properties p where p.id = property_id and (p.agent_id = (select auth.uid()) or private.is_admin()))) with check (exists(select 1 from public.properties p where p.id = property_id and (p.agent_id = (select auth.uid()) or private.is_admin())));

create policy favorites_owner on public.favorites for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy inquiries_select on public.inquiries for select to authenticated using (customer_id = (select auth.uid()) or agent_id = (select auth.uid()) or private.is_admin());
create policy inquiries_insert on public.inquiries for insert to authenticated with check (customer_id = (select auth.uid()));
create policy inquiries_update on public.inquiries for update to authenticated using (agent_id = (select auth.uid()) or private.is_admin()) with check (agent_id = (select auth.uid()) or private.is_admin());
create policy appointments_select on public.appointments for select to authenticated using (customer_id = (select auth.uid()) or agent_id = (select auth.uid()) or private.is_admin());
create policy appointments_insert on public.appointments for insert to authenticated with check (customer_id = (select auth.uid()));
create policy appointments_update on public.appointments for update to authenticated using (customer_id = (select auth.uid()) or agent_id = (select auth.uid()) or private.is_admin()) with check (customer_id = (select auth.uid()) or agent_id = (select auth.uid()) or private.is_admin());
create policy audit_admin on public.audit_logs for select to authenticated using (private.is_admin());

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('property-media', 'property-media', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict(id) do nothing;

create policy property_images_public on storage.objects for select using (bucket_id = 'property-media');
create policy property_images_insert on storage.objects for insert to authenticated with check (bucket_id = 'property-media' and (storage.foldername(name))[1] = (select auth.uid())::text and private.is_agent_or_admin());
create policy property_images_update on storage.objects for update to authenticated using (bucket_id = 'property-media' and ((storage.foldername(name))[1] = (select auth.uid())::text or private.is_admin()));
create policy property_images_delete on storage.objects for delete to authenticated using (bucket_id = 'property-media' and ((storage.foldername(name))[1] = (select auth.uid())::text or private.is_admin()));
