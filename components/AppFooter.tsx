import Link from "next/link";

export default function AppFooter() {
  return <footer className="app-footer"><div className="app-container"><div><strong>Homeverse</strong><p>Clear property information and accountable workflows for customers and agents.</p></div><nav aria-label="Footer"><Link href="/services">Services</Link><Link href="/blog">Guides</Link><Link href="/faq">FAQ</Link><Link href="/contact">Contact</Link><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link></nav></div></footer>;
}
