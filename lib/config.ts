export const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project"),
);

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const demoMode = !supabaseConfigured;
