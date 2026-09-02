import type { LucideIcon } from "lucide-react";
export default function MetricCard({ label, value, detail, icon: Icon }: { label: string; value: string | number; detail: string; icon: LucideIcon }) { return <article className="metric-card"><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div><Icon /></article>; }
