import Image from "next/image";
import { moderateListing } from "@/app/actions/platform";
import Notice from "@/components/Notice";
import { requireProfile } from "@/lib/auth";
import { getProperties } from "@/lib/data";

export default async function ModerationPage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) { await requireProfile(["admin"]); const [properties, messages] = await Promise.all([getProperties({}, true), searchParams]); return <><header className="dash-heading"><div><span className="app-eyebrow">Marketplace safety</span><h1>Listing moderation</h1><p>Review pending inventory before it becomes publicly searchable.</p></div></header><Notice {...messages} /><div className="moderation-grid">{properties.map((p) => <article className="dash-card moderation-card" key={p.id}><Image src={p.image} width={420} height={260} alt={p.title} /><div><span className={`status-pill ${p.status}`}>{p.status}</span><h2>{p.title}</h2><p>{p.address} · {p.bedrooms} beds · {p.areaSqft.toLocaleString()} ft²</p><form action={moderateListing}><input type="hidden" name="propertyId" value={p.id} /><button name="status" value="published" className="approve">Approve</button><button name="status" value="rejected" className="reject">Reject</button><button name="status" value="archived">Archive</button></form></div></article>)}</div></>; }
