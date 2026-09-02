import Link from "next/link";
import { notFound } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import PropertyCard from "@/components/PropertyCard";
import { amenityContent, findAmenity } from "@/lib/content";
import { getProperties } from "@/lib/data";

export function generateStaticParams() { return amenityContent.map(({ slug }) => ({ slug })); }
export default async function AmenityPage({ params }: { params: Promise<{ slug: string }> }) { const amenity = findAmenity((await params).slug); if (!amenity) notFound(); const properties = await getProperties({ amenity: amenity.query }); return <div className="app-shell"><AppHeader /><main><section className="content-hero"><div className="app-container"><Link href="/properties" className="app-back">← Property search</Link><span className="app-eyebrow">Property feature</span><h1>{amenity.title}</h1><p>{amenity.description}</p><Link href={`/properties?amenity=${encodeURIComponent(amenity.query)}`} className="app-button">Search with this feature</Link></div></section><section className="app-container content-section"><div className="section-row"><div><span className="app-eyebrow">Available now</span><h2>Homes matching this feature</h2></div><Link href="/properties">View all properties</Link></div>{properties.length ? <div className="app-property-grid">{properties.map((property) => <PropertyCard property={property} key={property.id} />)}</div> : <div className="app-empty"><h2>No current listing is tagged with this feature</h2><p>Try the full property search or check again when new homes are approved.</p><Link href="/properties" className="app-button">Browse all properties</Link></div>}</section></main><AppFooter /></div>; }
