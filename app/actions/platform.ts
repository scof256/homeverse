"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { demoMode } from "@/lib/config";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const listingSchema = z.object({
  title: z.string().min(5).max(140), description: z.string().min(30).max(5000),
  purpose: z.enum(["rent", "sale"]), propertyType: z.string().min(2).max(80),
  price: z.coerce.number().nonnegative(), city: z.string().min(2).max(100),
  country: z.string().min(2).max(100), address: z.string().min(5).max(200),
  bedrooms: z.coerce.number().int().nonnegative(), bathrooms: z.coerce.number().int().nonnegative(),
  areaSqft: z.coerce.number().int().positive(), amenities: z.string().max(1000).optional(),
});

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export async function createListing(formData: FormData) {
  const profile = await requireProfile(["agent", "admin"]);
  const values = listingSchema.safeParse(Object.fromEntries(formData));
  if (!values.success) redirect("/dashboard/listings/new?error=invalid-listing");
  if (demoMode) redirect("/dashboard/listings?notice=demo-listing-created");
  const supabase = await createClient();
  const input = values.data;
  const images = formData.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
  if (!images.length || images.length > 8 || images.some((file) => file.size > 5_242_880 || !["image/jpeg", "image/png", "image/webp"].includes(file.type))) redirect("/dashboard/listings/new?error=invalid-images");
  const { data: property, error } = await supabase.from("properties").insert({
    agent_id: profile.id, slug: `${slugify(input.title)}-${crypto.randomUUID().slice(0, 8)}`,
    title: input.title, description: input.description, purpose: input.purpose,
    property_type: input.propertyType, price: input.price, currency: "USD", country: input.country,
    city: input.city, address: input.address, bedrooms: input.bedrooms, bathrooms: input.bathrooms,
    area_sqft: input.areaSqft, amenities: input.amenities?.split(",").map((a) => a.trim()).filter(Boolean) || [], status: "draft",
  }).select("id").single();
  if (error) redirect(`/dashboard/listings/new?error=${encodeURIComponent(error.message)}`);
  const uploaded: string[] = [];
  for (const [index, image] of images.entries()) {
    const extension = image.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const storagePath = `${profile.id}/${property.id}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("property-media").upload(storagePath, image, { contentType: image.type, upsert: false });
    if (uploadError) {
      if (uploaded.length) await supabase.storage.from("property-media").remove(uploaded);
      await supabase.from("properties").delete().eq("id", property.id);
      redirect("/dashboard/listings/new?error=image-upload-failed");
    }
    uploaded.push(storagePath);
    const { error: mediaError } = await supabase.from("property_media").insert({ property_id: property.id, storage_path: storagePath, alt_text: input.title, sort_order: index });
    if (mediaError) redirect("/dashboard/listings/new?error=media-save-failed");
  }
  await supabase.from("properties").update({ status: "pending" }).eq("id", property.id);
  revalidatePath("/dashboard/listings"); redirect("/dashboard/listings?notice=listing-submitted");
}

export async function archiveListing(formData: FormData) {
  await requireProfile(["agent", "admin"]);
  const propertyId = String(formData.get("propertyId") || "");
  if (demoMode) redirect("/dashboard/listings?notice=listing-archived");
  const supabase = await createClient();
  await supabase.from("properties").update({ status: "archived" }).eq("id", propertyId);
  revalidatePath("/dashboard/listings"); revalidatePath("/properties"); redirect("/dashboard/listings?notice=listing-archived");
}

export async function sendInquiry(formData: FormData) {
  const profile = await requireProfile();
  const parsed = z.object({ propertyId: z.string().uuid(), slug: z.string(), message: z.string().min(10).max(2000) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect(`/properties/${formData.get("slug")}?error=invalid-inquiry`);
  if (demoMode) redirect(`/properties/${parsed.data.slug}?notice=inquiry-sent`);
  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").insert({ property_id: parsed.data.propertyId, customer_id: profile.id, agent_id: profile.id, message: parsed.data.message });
  if (error) redirect(`/properties/${parsed.data.slug}?error=${encodeURIComponent(error.message)}`);
  redirect(`/properties/${parsed.data.slug}?notice=inquiry-sent`);
}

export async function scheduleViewing(formData: FormData) {
  const profile = await requireProfile();
  const parsed = z.object({ propertyId: z.string().uuid(), slug: z.string(), scheduledAt: z.string().min(10), note: z.string().max(1000).optional() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect(`/properties/${formData.get("slug")}?error=invalid-appointment`);
  if (demoMode) redirect(`/properties/${parsed.data.slug}?notice=viewing-requested`);
  const supabase = await createClient();
  const { error } = await supabase.from("appointments").insert({ property_id: parsed.data.propertyId, customer_id: profile.id, agent_id: profile.id, scheduled_at: new Date(parsed.data.scheduledAt).toISOString(), note: parsed.data.note });
  if (error) redirect(`/properties/${parsed.data.slug}?error=${encodeURIComponent(error.message)}`);
  redirect(`/properties/${parsed.data.slug}?notice=viewing-requested`);
}

export async function toggleFavorite(formData: FormData) {
  const profile = await requireProfile();
  const propertyId = String(formData.get("propertyId")); const slug = String(formData.get("slug") || "");
  if (demoMode) redirect(slug ? `/properties/${slug}?notice=favorite-updated` : "/dashboard/favorites?notice=favorite-updated");
  const supabase = await createClient();
  const { data } = await supabase.from("favorites").select("property_id").eq("user_id", profile.id).eq("property_id", propertyId).maybeSingle();
  if (data) await supabase.from("favorites").delete().eq("user_id", profile.id).eq("property_id", propertyId);
  else await supabase.from("favorites").insert({ user_id: profile.id, property_id: propertyId });
  revalidatePath("/dashboard/favorites"); redirect(slug ? `/properties/${slug}?notice=favorite-updated` : "/dashboard/favorites");
}

export async function updateRole(formData: FormData) {
  await requireProfile(["admin"]);
  const parsed = z.object({ userId: z.string().uuid(), role: z.enum(["customer", "agent", "admin"]) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success || demoMode) redirect("/dashboard/users?notice=role-updated");
  const supabase = await createClient();
  await supabase.from("profiles").update({ role: parsed.data.role }).eq("id", parsed.data.userId);
  revalidatePath("/dashboard/users"); redirect("/dashboard/users?notice=role-updated");
}

export async function moderateListing(formData: FormData) {
  await requireProfile(["admin"]);
  const parsed = z.object({ propertyId: z.string().uuid(), status: z.enum(["published", "rejected", "archived"]) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success || demoMode) redirect("/dashboard/moderation?notice=listing-updated");
  const supabase = await createClient();
  await supabase.from("properties").update({ status: parsed.data.status, verified: parsed.data.status === "published" }).eq("id", parsed.data.propertyId);
  revalidatePath("/dashboard/moderation"); revalidatePath("/properties"); redirect("/dashboard/moderation?notice=listing-updated");
}

export async function sendContactMessage(formData: FormData) {
  const parsed = z.object({
    name: z.string().min(2).max(120), email: z.string().email().max(255), phone: z.string().max(40).optional(),
    subject: z.string().min(3).max(160), message: z.string().min(20).max(3000),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/contact?error=check-your-message");
  if (demoMode) redirect("/contact?notice=message-received");
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert(parsed.data);
  if (error) redirect("/contact?error=message-not-sent");
  redirect("/contact?notice=message-received");
}
