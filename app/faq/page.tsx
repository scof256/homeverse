import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

const faqs = [
  ["Do I need an account to search properties?", "No. Property search and public listing details are available without signing in. An account is required to save a home, send an enquiry or request a viewing."],
  ["How do I become an agent?", "Create a customer account first, then contact Homeverse with your agency and licence information. An administrator reviews and grants agent access."],
  ["Why is my new listing not public?", "Agent listings are submitted for moderation. They remain pending until an administrator approves them, or returns them for correction."],
  ["Can I arrange a viewing through Homeverse?", "Yes. Open the property, choose a date and time at least two hours ahead, and submit the request. The agent can then confirm it."],
  ["How do I report inaccurate information?", "Use the contact page and choose Report a listing. Include the property title or page address and explain the concern clearly."],
  ["Does Homeverse complete legal or financial checks?", "No. Homeverse supports discovery and communication. Buyers, renters and sellers should use qualified legal, financial and technical professionals before committing."],
];
export const metadata = { title: "Frequently Asked Questions" };
export default function FaqPage() { return <div className="app-shell"><AppHeader /><main><section className="content-hero"><div className="app-container"><span className="app-eyebrow">Help centre</span><h1>Frequently asked questions</h1><p>Quick answers about accounts, listings, agents and property appointments.</p></div></section><section className="app-container content-section narrow"><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div><div className="content-callout"><h2>Still need help?</h2><p>Send the support team a clear description of the issue.</p><Link href="/contact" className="app-button">Contact support</Link></div></section></main><AppFooter /></div>; }
