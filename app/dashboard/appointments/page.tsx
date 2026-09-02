import { CalendarDays } from "lucide-react";
import { requireProfile } from "@/lib/auth";
import { getAppointments } from "@/lib/data";

export default async function AppointmentsPage() { await requireProfile(); const appointments = await getAppointments(); return <><header className="dash-heading"><div><span className="app-eyebrow">Schedule</span><h1>Viewings</h1><p>Track requested and confirmed property appointments.</p></div></header><div className="dash-card dash-list large">{appointments.map((item) => <div key={item.id}><div className="date-box"><b>{new Date(item.scheduledAt).getDate()}</b><span>{new Date(item.scheduledAt).toLocaleString("en-US", { month: "short" })}</span></div><div><b>{item.propertyTitle}</b><span><CalendarDays size={14} /> {new Date(item.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div><span className={`status-pill ${item.status}`}>{item.status}</span></div>)}</div></>; }
