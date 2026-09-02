import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import Notice from "@/components/Notice";
import { archiveListing } from "@/app/actions/platform";
import { requireProfile } from "@/lib/auth";
import { getProperties } from "@/lib/data";

export default async function ListingsPage({ searchParams }: { searchParams: Promise<{ notice?: string; error?: string }> }) { await requireProfile(["agent", "admin"]); const [properties, messages] = await Promise.all([getProperties({}, true), searchParams]); return <><header className="dash-heading"><div><span className="app-eyebrow">Inventory</span><h1>Listings</h1><p>Create, submit, and track the review status of every property.</p></div><Link href="/dashboard/listings/new" className="app-button"><Plus size={18} />Add listing</Link></header><Notice {...messages} /><div className="dash-card table-card"><table><thead><tr><th>Property</th><th>Purpose</th><th>Price</th><th>Status</th><th>Added</th><th>Action</th></tr></thead><tbody>{properties.map((p) => <tr key={p.id}><td><div className="table-property"><Image src={p.image} width={60} height={44} alt="" /><div><b>{p.title}</b><span>{p.city}</span></div></div></td><td>{p.purpose}</td><td>{new Intl.NumberFormat("en-US", { style: "currency", currency: p.currency, maximumFractionDigits: 0 }).format(p.price)}</td><td><span className={`status-pill ${p.status}`}>{p.status}</span></td><td>{new Date(p.createdAt).toLocaleDateString()}</td><td>{p.status !== "archived" && <form action={archiveListing}><input type="hidden" name="propertyId" value={p.id} /><button className="table-action">Archive</button></form>}</td></tr>)}</tbody></table></div></>; }
