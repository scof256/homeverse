import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bath, BedDouble, CalendarDays, Check, Heart, MapPin, MoveDiagonal, ShieldCheck } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import Notice from "@/components/Notice";
import { formatPrice } from "@/components/PropertyCard";
import { getProperty } from "@/lib/data";
import { scheduleViewing, sendInquiry, toggleFavorite } from "@/app/actions/platform";

export default async function PropertyDetail({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ notice?: string; error?: string }> }) {
  const { slug } = await params; const messages = await searchParams; const property = await getProperty(slug); if (!property) notFound();
  return <div className="app-shell"><AppHeader /><main className="app-container app-detail"><Notice {...messages} /><Link href="/properties" className="app-back">← Back to all properties</Link>
    <div className="app-detail-heading"><div><span className="app-eyebrow">For {property.purpose} · {property.propertyType}</span><h1>{property.title}</h1><p><MapPin size={18} />{property.address}</p></div><div className="app-detail-price">{formatPrice(property)}<small>{property.purpose === "rent" ? " per month" : " asking price"}</small></div></div>
    <div className="app-gallery"><Image src={property.images[0]} alt={property.title} width={1000} height={700} priority />{property.images.slice(1, 3).map((image, index) => <Image key={image} src={image} alt={`${property.title} view ${index + 2}`} width={500} height={340} />)}</div>
    <div className="app-detail-grid"><article className="app-detail-main"><div className="app-facts"><span><BedDouble /> <b>{property.bedrooms}</b> Bedrooms</span><span><Bath /> <b>{property.bathrooms}</b> Bathrooms</span><span><MoveDiagonal /> <b>{property.areaSqft.toLocaleString()}</b> Square feet</span>{property.verified && <span><ShieldCheck /> <b>Verified</b> Listing</span>}</div><section><h2>About this home</h2><p>{property.description}</p></section><section><h2>Amenities</h2><div className="app-amenities">{property.amenities.map((item) => <span key={item}><Check size={17} />{item}</span>)}</div></section></article>
      <aside className="app-contact-card"><div className="app-agent"><Image src={property.agent?.avatarUrl || "/assets/images/author.jpg"} width={56} height={56} alt="Listing agent" /><div><b>{property.agent?.fullName || "Homeverse Agent"}</b><small>{property.agent?.agencyName || "Licensed real estate agent"}</small></div></div><form action={sendInquiry}><input type="hidden" name="propertyId" value={property.id} /><input type="hidden" name="slug" value={property.slug} /><label>Your message<textarea name="message" required minLength={10} defaultValue={`I'm interested in ${property.title}. Please contact me with more information.`} /></label><button className="app-button app-button-full">Send inquiry</button></form><div className="app-divider">or request a viewing</div><form action={scheduleViewing}><input type="hidden" name="propertyId" value={property.id} /><input type="hidden" name="slug" value={property.slug} /><label>Date and time<input name="scheduledAt" type="datetime-local" required /></label><label>Note<input name="note" placeholder="Any access needs?" /></label><button className="app-button app-button-secondary app-button-full"><CalendarDays size={17} /> Schedule viewing</button></form><form action={toggleFavorite}><input type="hidden" name="propertyId" value={property.id} /><input type="hidden" name="slug" value={property.slug} /><button className="app-text-button"><Heart size={17} /> Save to favorites</button></form></aside>
    </div></main></div>;
}
