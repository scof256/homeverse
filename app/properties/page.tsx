import type { Metadata } from "next";
import AppHeader from "@/components/AppHeader";
import PropertyCard from "@/components/PropertyCard";
import { getProperties } from "@/lib/data";

export const metadata: Metadata = { title: "Properties | Homeverse", description: "Search verified homes for sale and rent." };

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const properties = await getProperties({ query: params.q, city: params.city, purpose: params.purpose, type: params.type, minPrice: Number(params.min) || undefined, maxPrice: Number(params.max) || undefined, bedrooms: Number(params.beds) || undefined, amenity: params.amenity });
  return <div className="app-shell"><AppHeader /><main className="app-container app-page"><div className="app-page-heading"><div><span className="app-eyebrow">Property marketplace</span><h1>Find a place that feels right</h1><p>Search verified listings, compare the essentials, and speak directly with the listing agent.</p></div><strong>{properties.length} homes</strong></div>
    <form className="app-filter" action="/properties"><input type="hidden" name="amenity" value={params.amenity || ""} /><label>Search<input name="q" defaultValue={params.q} placeholder="City, address or keyword" /></label><label>Purpose<select name="purpose" defaultValue={params.purpose || ""}><option value="">Buy or rent</option><option value="sale">For sale</option><option value="rent">For rent</option></select></label><label>Type<select name="type" defaultValue={params.type || ""}><option value="">All types</option><option>Apartment</option><option>Condominium</option><option>Villa</option><option>Townhouse</option></select></label><label>Min price<input name="min" type="number" min="0" defaultValue={params.min} placeholder="$0" /></label><label>Beds<select name="beds" defaultValue={params.beds || ""}><option value="">Any</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select></label><button className="app-button" type="submit">Search homes</button></form>
    {properties.length ? <div className="app-property-grid">{properties.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <div className="app-empty"><h2>No matching homes yet</h2><p>Remove a filter or try a different location.</p></div>}
  </main></div>;
}
