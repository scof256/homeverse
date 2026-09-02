import Link from "next/link";
export default function NotFound() { return <main className="app-shell app-empty"><span className="app-eyebrow">404</span><h1>That property isn’t available</h1><p>It may have been removed, archived, or the address may be incorrect.</p><Link className="app-button" href="/properties">Browse available homes</Link></main>; }
