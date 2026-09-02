import { cache } from "react";
import { redirect } from "next/navigation";
import { demoMode } from "@/lib/config";
import { demoProfiles } from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types";

export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  if (demoMode) {
    const requestedRole = process.env.HOMEVERSE_DEMO_ROLE as UserRole | undefined;
    return demoProfiles[requestedRole && demoProfiles[requestedRole] ? requestedRole : "admin"];
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (claimsError || !userId) return null;

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (error || !data) return null;
  return {
    id: data.id,
    fullName: data.full_name,
    email: data.email,
    phone: data.phone || undefined,
    avatarUrl: data.avatar_url || undefined,
    bio: data.bio || undefined,
    agencyName: data.agency_name || undefined,
    licenseNumber: data.license_number || undefined,
    role: data.role,
    createdAt: data.created_at,
  };
});

export async function requireProfile(roles?: UserRole[]) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?next=/dashboard");
  if (roles && !roles.includes(profile.role)) redirect("/dashboard?error=forbidden");
  return profile;
}
