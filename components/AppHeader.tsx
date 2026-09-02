import Image from "next/image";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";

export default async function AppHeader() {
  const profile = await getCurrentProfile();
  return (
    <header className="app-header">
      <div className="app-container app-header-inner">
        <Link href="/" className="app-logo"><Image src="/assets/images/logo.png" width={230} height={34} alt="Homeverse" priority /></Link>
        <nav aria-label="Primary"><Link href="/properties">Properties</Link><Link href="/#service">Services</Link><Link href="/#about">About</Link></nav>
        <div className="app-header-actions">
          {profile ? <Link href="/dashboard" className="app-button app-button-small">Dashboard</Link> : <><Link href="/login">Sign in</Link><Link href="/signup" className="app-button app-button-small">Create account</Link></>}
        </div>
      </div>
    </header>
  );
}
