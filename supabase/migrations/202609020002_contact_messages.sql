create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) <= 255),
  phone text check (char_length(phone) <= 40),
  subject text not null check (char_length(subject) between 3 and 160),
  message text not null check (char_length(message) between 20 and 3000),
  status text not null default 'new' check (status in ('new', 'reviewed', 'closed')),
  created_at timestamptz not null default now()
);

create index contact_messages_status_idx on public.contact_messages(status, created_at desc);
create index contact_messages_email_idx on public.contact_messages(email, created_at desc);

alter table public.contact_messages enable row level security;
create policy contact_messages_create on public.contact_messages for insert to anon, authenticated with check (status = 'new');
create policy contact_messages_admin_select on public.contact_messages for select to authenticated using (private.is_admin());
create policy contact_messages_admin_update on public.contact_messages for update to authenticated using (private.is_admin()) with check (private.is_admin());

create function private.limit_contact_messages() returns trigger
language plpgsql security definer set search_path = '' as $$
declare recent_count integer;
begin
  select count(*) into recent_count from public.contact_messages
  where lower(email) = lower(new.email) and created_at > now() - interval '1 day';
  if recent_count >= 5 then raise exception 'Contact message rate limit reached'; end if;
  return new;
end;
$$;

create trigger contact_messages_limit before insert on public.contact_messages
for each row execute function private.limit_contact_messages();
