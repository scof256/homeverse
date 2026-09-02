/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel packages Next.js output itself. Standalone output is retained for
  // the Docker/self-hosted build, where the generated server.js is required.
  ...(process.env.VERCEL ? {} : { output: "standalone" }),
  poweredByHeader: false,
  compress: true,
  experimental: { serverActions: { bodySizeLimit: "50mb" } },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [{ source: "/(.*)", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Content-Security-Policy", value: "default-src 'self'; img-src 'self' data: blob: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-ancestors 'self'; base-uri 'self'; form-action 'self'" },
    ] }];
  },
};

export default nextConfig;
