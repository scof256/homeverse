import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { serviceContent } from "@/lib/content";

export const metadata = { title: "Property Services", description: "Practical support for buying, renting and selling a home through Homeverse." };
export default function ServicesPage() { return <div className="app-shell"><AppHeader /><main><section className="content-hero"><div className="app-container"><span className="app-eyebrow">Homeverse services</span><h1>Choose the property journey you’re on</h1><p>Each service opens a complete path with the right search, listing and communication tools.</p></div></section><section className="app-container content-section"><div className="service-detail-grid">{serviceContent.map((service) => <article className="service-detail-card" key={service.slug}><Image src={service.image} width={185} height={140} alt="" /><div><span className="app-eyebrow">{service.shortTitle}</span><h2>{service.title}</h2><p>{service.summary}</p><ul>{service.steps.slice(0, 3).map((step) => <li key={step}><CheckCircle2 size={17} />{step}</li>)}</ul><Link href={`/services/${service.slug}`}>View full service <ArrowRight size={17} /></Link></div></article>)}</div></section></main><AppFooter /></div>; }
