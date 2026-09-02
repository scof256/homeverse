import Image from "next/image";
import Link from "next/link";
import { Building2, CalendarDays, Gauge, Heart, Home, LogOut, MessageSquare, PlusCircle, ShieldCheck, Users } from "lucide-react";
import { logout } from "@/app/actions/auth";
import type { Profile } from "@/types";

export default function DashboardNav({ profile }: { profile: Profile }) {
  const common = [{ href: "/dashboard", label: "Overview", icon: Gauge }, { href: "/dashboard/favorites", label: "Favorites", icon: Heart }, { href: "/dashboard/appointments", label: "Viewings", icon: CalendarDays }];
  const agent = [{ href: "/dashboard/listings", label: "My listings", icon: Building2 }, { href: "/dashboard/listings/new", label: "Add listing", icon: PlusCircle }, { href: "/dashboard/inquiries", label: "Leads", icon: MessageSquare }];
  const admin = [{ href: "/dashboard/users", label: "Users & roles", icon: Users }, { href: "/dashboard/moderation", label: "Moderation", icon: ShieldCheck }];
  const items = [...common, ...(profile.role === "agent" || profile.role === "admin" ? agent : []), ...(profile.role === "admin" ? admin : [])];
  return <aside className="dash-nav"><Link href="/" className="dash-logo"><Image src="/assets/images/logo-light.png" width={230} height={34} alt="Homeverse" /></Link><div className="dash-profile"><div className="dash-avatar">{profile.fullName.slice(0, 1)}</div><div><b>{profile.fullName}</b><span>{profile.role}</span></div></div><nav>{items.map(({ href, label, icon: Icon }) => <Link href={href} key={href}><Icon size={19} />{label}</Link>)}</nav><div className="dash-nav-bottom"><Link href="/properties"><Home size={19} />Browse properties</Link><form action={logout}><button><LogOut size={19} />Sign out</button></form></div></aside>;
}
