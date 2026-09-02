import DashboardNav from "@/components/DashboardNav";
import { requireProfile } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) { const profile = await requireProfile(); return <div className="dash-shell"><DashboardNav profile={profile} /><div className="dash-content">{children}</div></div>; }
