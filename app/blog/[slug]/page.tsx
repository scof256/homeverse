import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { notFound } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { blogPosts, findPost } from "@/lib/content";

export function generateStaticParams() { return blogPosts.map(({ slug }) => ({ slug })); }
export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) { const post = findPost((await params).slug); if (!post) notFound(); return <div className="app-shell"><AppHeader /><main className="article-page app-container"><Link href="/blog" className="app-back">← All property guides</Link><header><span className="app-eyebrow">{post.category}</span><h1>{post.title}</h1><p>{post.excerpt}</p><time dateTime={post.date}><CalendarDays size={16} />{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}</time></header><Image className="article-cover" src={post.image} width={1100} height={650} alt={post.title} priority /><article>{post.sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}<div className="content-callout"><h2>Put the guide into practice</h2><p>Compare verified listings and contact the responsible agent from each property page.</p><Link href="/properties" className="app-button">Browse properties</Link></div></article></main><AppFooter /></div>; }
