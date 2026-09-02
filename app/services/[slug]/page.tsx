import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { findService, serviceContent } from "@/lib/content";

export function generateStaticParams() { return serviceContent.map(({ slug }) => ({ slug })); }
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) { const service = findService((await params).slug); if (!service) notFound(); return <div className="app-shell"><AppHeader /><main><section className="content-hero service-hero"><div className="app-container service-hero-grid"><div><Link href="/services" className="app-back">← All services</Link><span className="app-eyebrow">{service.shortTitle} with Homeverse</span><h1>{service.title}</h1><p>{service.summary}</p><Link href={service.href} className="app-button">{service.cta}<ArrowRight size={18} /></Link></div><Image src={service.image} width={370} height={280} alt="" priority /></div></section><section className="app-container content-section narrow"><span className="app-eyebrow">How it works</span><h2>A clear path from first step to decision</h2><ol className="process-list">{service.steps.map((step, index) => <li key={step}><span>{index + 1}</span><div><CheckCircle2 size={20} /><b>{step}</b><p>Your activity stays connected to your Homeverse account so you can return to it later.</p></div></li>)}</ol><div className="content-callout"><h2>Ready to continue?</h2><p>Use the marketplace and dashboard tools built for this service.</p><Link href={service.href} className="app-button">{service.cta}</Link></div></section></main><AppFooter /></div>; }
