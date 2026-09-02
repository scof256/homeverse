import Image from "next/image";
import Link from "next/link";
import Notice from "@/components/Notice";
import { login } from "@/app/actions/auth";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; notice?: string; next?: string }> }) {
  const params = await searchParams;
  return <main className="auth-shell"><section className="auth-panel"><Link href="/"><Image src="/assets/images/logo.png" width={230} height={34} alt="Homeverse" priority /></Link><div><span className="app-eyebrow">Welcome back</span><h1>Sign in to Homeverse</h1><p>Manage favorites, viewings, listings, and leads from one secure workspace.</p></div><Notice {...params} /><form action={login} className="app-form"><input type="hidden" name="next" value={params.next || "/dashboard"} /><label>Email address<input name="email" type="email" autoComplete="email" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" minLength={8} required /></label><button className="app-button app-button-full">Sign in</button></form><p>New to Homeverse? <Link href="/signup">Create an account</Link></p></section><section className="auth-visual"><Image src="/assets/images/hero-banner.png" width={717} height={541} alt="A modern home" priority /><h2>Your property journey, organized.</h2><p>Built for renters, buyers, agents and marketplace teams.</p></section></main>;
}
