import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, Heart, MapPin, MoveDiagonal } from "lucide-react";
import type { Property } from "@/types";

export const formatPrice = (property: Property) => new Intl.NumberFormat("en-US", { style: "currency", currency: property.currency, maximumFractionDigits: 0 }).format(property.price);

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <article className="app-property-card">
      <Link href={`/properties/${property.slug}`} className="app-property-image">
        <Image src={property.image} alt={property.title} width={720} height={480} />
        <span className={`app-badge ${property.purpose}`}>For {property.purpose}</span>
        {property.verified && <span className="app-verified">Verified</span>}
      </Link>
      <div className="app-property-body">
        <div className="app-price">{formatPrice(property)}{property.purpose === "rent" && <small>/month</small>}</div>
        <h2><Link href={`/properties/${property.slug}`}>{property.title}</Link></h2>
        <p className="app-location"><MapPin size={16} /> {property.address}</p>
        <div className="app-property-meta"><span><BedDouble size={17} />{property.bedrooms} beds</span><span><Bath size={17} />{property.bathrooms} baths</span><span><MoveDiagonal size={17} />{property.areaSqft.toLocaleString()} ft²</span></div>
      </div>
      <div className="app-property-footer"><span>Listed by {property.agent?.fullName || "Homeverse agent"}</span><Heart size={18} aria-label="Save property" /></div>
    </article>
  );
}
