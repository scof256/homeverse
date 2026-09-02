"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { demoMode, siteUrl } from "@/lib/config";

export async function login(formData: FormData) {
  if (demoMode) redirect("/dashboard?notice=demo-mode");
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/dashboard");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard");
}

export async function signup(formData: FormData) {
  if (demoMode) redirect("/dashboard?notice=demo-mode");
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("fullName") || "").trim();
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName }, emailRedirectTo: `${siteUrl}/auth/callback` } });
  if (error) redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  redirect("/login?notice=check-email");
}

export async function logout() {
  if (!demoMode) { const supabase = await createClient(); await supabase.auth.signOut(); }
  redirect("/");
}
