import { demoMode } from "@/lib/config";
import { demoAppointments, demoInquiries, demoProfiles, demoProperties } from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/server";
import type { Appointment, Inquiry, Profile, Property, PropertyFilters } from "@/types";

function mapProperty(row: any): Property {
  const media = [...(row.property_media || [])].sort((a, b) => a.sort_order - b.sort_order);
  const images = media.map((item) => {
    if (item.storage_path?.startsWith("http")) return item.storage_path;
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/property-media/${item.storage_path}`;
    return url;
  });
  const profile = row.profiles;
  return {
    id: row.id, agentId: row.agent_id, slug: row.slug, title: row.title,
    description: row.description, purpose: row.purpose, propertyType: row.property_type,
    price: Number(row.price), currency: row.currency, country: row.country, city: row.city,
    address: row.address, bedrooms: row.bedrooms, bathrooms: row.bathrooms,
    areaSqft: row.area_sqft, yearBuilt: row.year_built || undefined,
    latitude: row.latitude ? Number(row.latitude) : undefined, longitude: row.longitude ? Number(row.longitude) : undefined,
    amenities: row.amenities || [], status: row.status, featured: row.featured, verified: row.verified,
    image: images[0] || "/assets/images/property-1.jpg", images: images.length ? images : ["/assets/images/property-1.jpg"],
    agent: profile ? { id: profile.id, fullName: profile.full_name, email: profile.email, phone: profile.phone, avatarUrl: profile.avatar_url, role: profile.role } : undefined,
    createdAt: row.created_at,
  };
}

export async function getProperties(filters: PropertyFilters = {}, includeUnpublished = false): Promise<Property[]> {
  if (demoMode) {
    const q = filters.query?.toLowerCase();
    return demoProperties.filter((property) => {
      if (!includeUnpublished && property.status !== "published") return false;
      if (q && !`${property.title} ${property.city} ${property.address}`.toLowerCase().includes(q)) return false;
      if (filters.city && property.city !== filters.city) return false;
      if (filters.purpose && property.purpose !== filters.purpose) return false;
      if (filters.type && property.propertyType !== filters.type) return false;
      if (filters.minPrice && property.price < filters.minPrice) return false;
      if (filters.maxPrice && property.price > filters.maxPrice) return false;
      if (filters.bedrooms && property.bedrooms < filters.bedrooms) return false;
      return true;
    });
  }
  const supabase = await createClient();
  let query = supabase.from("properties").select("*, property_media(*), profiles!properties_agent_id_fkey(*)").order("featured", { ascending: false }).order("created_at", { ascending: false });
  if (!includeUnpublished) query = query.eq("status", "published");
  if (filters.query) {
    const safeSearch = filters.query.replace(/[,()%]/g, " ").trim().slice(0, 100);
    if (safeSearch) query = query.or(`title.ilike.%${safeSearch}%,city.ilike.%${safeSearch}%,address.ilike.%${safeSearch}%`);
  }
  if (filters.city) query = query.eq("city", filters.city);
  if (filters.purpose) query = query.eq("purpose", filters.purpose);
  if (filters.type) query = query.eq("property_type", filters.type);
  if (filters.minPrice) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice) query = query.lte("price", filters.maxPrice);
  if (filters.bedrooms) query = query.gte("bedrooms", filters.bedrooms);
  const { data, error } = await query.limit(100);
  if (error) throw new Error("Unable to load properties");
  return (data || []).map(mapProperty);
}

export async function getProperty(slug: string) {
  if (demoMode) return demoProperties.find((item) => item.slug === slug && item.status === "published") || null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("properties").select("*, property_media(*), profiles!properties_agent_id_fkey(*)").eq("slug", slug).eq("status", "published").single();
  return error || !data ? null : mapProperty(data);
}

export async function getProfiles(): Promise<Profile[]> {
  if (demoMode) return Object.values(demoProfiles);
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  return (data || []).map((row) => ({ id: row.id, fullName: row.full_name, email: row.email, phone: row.phone, role: row.role, agencyName: row.agency_name, licenseNumber: row.license_number, createdAt: row.created_at }));
}

export async function getInquiries(): Promise<Inquiry[]> {
  if (demoMode) return demoInquiries;
  const supabase = await createClient();
  const { data } = await supabase.from("inquiries").select("*, properties(title), profiles!inquiries_customer_id_fkey(full_name,email)").order("created_at", { ascending: false });
  return (data || []).map((row: any) => ({ id: row.id, propertyId: row.property_id, propertyTitle: row.properties?.title || "Property", customerName: row.profiles?.full_name || "Customer", customerEmail: row.profiles?.email || "", message: row.message, status: row.status, createdAt: row.created_at }));
}

export async function getAppointments(): Promise<Appointment[]> {
  if (demoMode) return demoAppointments;
  const supabase = await createClient();
  const { data } = await supabase.from("appointments").select("*, properties(title)").order("scheduled_at");
  return (data || []).map((row: any) => ({ id: row.id, propertyTitle: row.properties?.title || "Property", scheduledAt: row.scheduled_at, status: row.status }));
}

export async function getFavorites(userId: string): Promise<Property[]> {
  if (demoMode) return demoProperties.slice(0, 2);
  const supabase = await createClient();
  const { data } = await supabase.from("favorites").select("properties(*, property_media(*), profiles!properties_agent_id_fkey(*))").eq("user_id", userId);
  return (data || []).flatMap((row: any) => row.properties ? [mapProperty(row.properties)] : []);
}
