"use client";
import { useEffect, useState } from "react";
import { CalendarCheck, Layers, Star, Image, Users, Clock, CheckCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { bookingsApi, servicesApi, reviewsApi, usersApi, type BookingStats, type Booking } from "@/lib/api";
import { DashboardSkeleton } from "./_components/Skeletons";

const SADDLE = "#84572F";
const TUSCAN = "#F1A805";

function StatCard({ label, value, icon: Icon, color, href }: {
  label: string; value: number | string; icon: React.ElementType; color: string; href: string;
}) {
  return (
    <Link href={href} className="block rounded-2xl p-6 transition-all hover:scale-[1.02] hover:shadow-lg"
      style={{ background: "#fff", border: `1px solid ${TUSCAN}15`, boxShadow: `0 2px 12px ${TUSCAN}08` }}>
      <div className="flex items-center justify-between mb-4">
        <span className="font-cinzel text-xs tracking-[0.3em] uppercase" style={{ color: `${SADDLE}80` }}>{label}</span>
        <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon size={18} style={{ color }} />
        </span>
      </div>
      <p className="font-playfair text-3xl font-bold" style={{ color: SADDLE }}>{value}</p>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [counts, setCounts] = useState({ services: 0, reviews: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      bookingsApi.adminStats(),
      bookingsApi.adminList(),
      servicesApi.adminList(),
      reviewsApi.adminList(),
      usersApi.list(),
    ]).then(([bStats, bookings, services, reviews, users]) => {
      setStats(bStats);
      setRecentBookings(bookings.slice(0, 5));
      setCounts({
        services: services.length,
        reviews: reviews.filter((r) => !r.isApproved).length,
        users: users.length,
      });
    }).finally(() => setLoading(false));
  }, []);

  const STATUS_COLORS: Record<string, string> = {
    pending: "#F59E0B",
    confirmed: "#3B82F6",
    in_progress: "#8B5CF6",
    completed: "#10B981",
    cancelled: "#EF4444",
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-playfair text-2xl font-bold" style={{ color: SADDLE }}>Overview</h2>
        <p className="font-dm text-sm mt-1" style={{ color: `${SADDLE}70` }}>Welcome back, here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Bookings" value={stats?.total ?? 0} icon={CalendarCheck} color="#3B82F6" href="/admin/bookings" />
        <StatCard label="Pending" value={stats?.pending ?? 0} icon={Clock} color="#F59E0B" href="/admin/bookings?status=pending" />
        <StatCard label="Completed" value={stats?.completed ?? 0} icon={CheckCircle} color="#10B981" href="/admin/bookings?status=completed" />
        <StatCard label="Services" value={counts.services} icon={Layers} color={TUSCAN} href="/admin/services" />
        <StatCard label="Pending Reviews" value={counts.reviews} icon={Star} color="#8B5CF6" href="/admin/reviews" />
        <StatCard label="Total Users" value={counts.users} icon={Users} color={SADDLE} href="/admin/users" />
        <StatCard label="Confirmed" value={stats?.confirmed ?? 0} icon={TrendingUp} color="#06B6D4" href="/admin/bookings?status=confirmed" />
        <StatCard label="Gallery" value="Manage" icon={Image} color="#EC4899" href="/admin/gallery" />
      </div>

      {/* Recent bookings */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: `1px solid ${TUSCAN}15`, boxShadow: `0 2px 12px ${TUSCAN}08` }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: `${TUSCAN}15` }}>
          <h3 className="font-playfair text-base font-bold" style={{ color: SADDLE }}>Recent Bookings</h3>
          <Link href="/admin/bookings" className="font-cinzel text-[11px] tracking-[0.3em] uppercase hover:opacity-70" style={{ color: TUSCAN }}>
            View All →
          </Link>
        </div>
        {recentBookings.length === 0 ? (
          <p className="px-6 py-8 font-dm text-sm text-center" style={{ color: `${SADDLE}60` }}>No bookings yet.</p>
        ) : (
          <div className="divide-y" style={{ borderColor: `${TUSCAN}10` }}>
            {recentBookings.map((b) => (
              <Link key={b.id} href="/admin/bookings" className="flex items-center justify-between px-6 py-4 hover:bg-amber-50/40 transition-colors">
                <div>
                  <p className="font-dm text-sm font-medium" style={{ color: SADDLE }}>{b.customerName}</p>
                  <p className="font-dm text-xs mt-0.5" style={{ color: `${SADDLE}60` }}>
                    {b.service?.name} · {b.bookingNumber}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-dm text-xs" style={{ color: `${SADDLE}60` }}>
                    {new Date(b.createdAt).toLocaleDateString("en-IN")}
                  </span>
                  <span
                    className="px-2.5 py-1 rounded-full font-cinzel text-[11px] tracking-[0.2em] uppercase"
                    style={{ background: `${STATUS_COLORS[b.status]}15`, color: STATUS_COLORS[b.status] }}
                  >
                    {b.status.replace("_", " ")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
