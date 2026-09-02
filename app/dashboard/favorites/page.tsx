import PropertyCard from "@/components/PropertyCard";
import { requireProfile } from "@/lib/auth";
import { getFavorites } from "@/lib/data";

export default async function FavoritesPage() { const profile = await requireProfile(); const properties = await getFavorites(profile.id); return <><header className="dash-heading"><div><span className="app-eyebrow">Your shortlist</span><h1>Saved properties</h1><p>Keep the strongest options together while you compare.</p></div></header><div className="app-property-grid compact">{properties.map((property) => <PropertyCard property={property} key={property.id} />)}</div></>; }
