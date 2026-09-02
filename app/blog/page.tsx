import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { blogPosts } from "@/lib/content";

export const metadata = { title: "Property Guides", description: "Practical Homeverse guides for buyers, renters and property sellers." };
export default function BlogPage() { return <div className="app-shell"><AppHeader /><main><section className="content-hero"><div className="app-container"><span className="app-eyebrow">Property guides</span><h1>Make better property decisions</h1><p>Useful questions, checks and preparation for renting, buying, selling and viewing a home.</p></div></section><section className="app-container content-section"><div className="guide-grid">{blogPosts.map((post) => <article className="guide-card" key={post.slug}><Link href={`/blog/${post.slug}`}><Image src={post.image} width={720} height={480} alt={post.title} /></Link><div><span className="app-eyebrow">{post.category}</span><h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p>{post.excerpt}</p><footer><span><CalendarDays size={15} />{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}</span><Link href={`/blog/${post.slug}`}>Read guide <ArrowRight size={16} /></Link></footer></div></article>)}</div></section></main><AppFooter /></div>; }
