import Image from "next/image";
import Link from "next/link";
import Notice from "@/components/Notice";
import { signup } from "@/app/actions/auth";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return <main className="auth-shell"><section className="auth-panel"><Link href="/"><Image src="/assets/images/logo.png" width={230} height={34} alt="Homeverse" priority /></Link><div><span className="app-eyebrow">Create your account</span><h1>Start your home search</h1><p>Every new account starts safely as a customer. Administrators can approve agent access later.</p></div><Notice {...params} /><form action={signup} className="app-form"><label>Full name<input name="fullName" autoComplete="name" required minLength={2} /></label><label>Email address<input name="email" type="email" autoComplete="email" required /></label><label>Password<input name="password" type="password" autoComplete="new-password" required minLength={8} /><small>Use at least 8 characters.</small></label><button className="app-button app-button-full">Create account</button></form><p>Already have an account? <Link href="/login">Sign in</Link></p></section><section className="auth-visual"><Image src="/assets/images/about-banner-1.png" width={574} height={722} alt="A bright home interior" priority /><h2>Shortlist, enquire, and schedule.</h2><p>Move from discovery to a confirmed viewing without losing the thread.</p></section></main>;
}
