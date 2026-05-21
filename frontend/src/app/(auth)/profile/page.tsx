"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  User, Mail, Shield, Calendar, CalendarCheck,
  ChevronRight, Clock, CheckCircle2, XCircle, Loader2, AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { bookingsApi, type Booking } from "@/lib/api";

const SADDLE = "#84572F";
const TUSCAN = "#F1A805";
const TEAL = "#00A693";

type BookingStatus = Booking["status"];

const STATUS_META: Record<BookingStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending:     { label: "Pending",     color: "#d97706", bg: "#fef3c7", icon: <Clock size={12} /> },
  confirmed:   { label: "Confirmed",   color: "#0284c7", bg: "#e0f2fe", icon: <CheckCircle2 size={12} /> },
  in_progress: { label: "In Progress", color: TEAL,      bg: "#ccfbf1", icon: <Loader2 size={12} className="animate-spin" /> },
  completed:   { label: "Completed",   color: "#16a34a", bg: "#dcfce7", icon: <CheckCircle2 size={12} /> },
  cancelled:   { label: "Cancelled",   color: "#dc2626", bg: "#fee2e2", icon: <XCircle size={12} /> },
};

function StatusBadge({ status }: { status: BookingStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-cinzel text-[9px] tracking-[0.15em] uppercase font-semibold"
      style={{ color: meta.color, background: meta.bg }}
    >
      {meta.icon}
      {meta.label}
    </span>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const eventDate = new Date(booking.eventDate + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
      style={{ background: `${TUSCAN}06`, border: `1px solid ${TUSCAN}20` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-dm font-semibold text-sm truncate" style={{ color: SADDLE }}>
            {booking.service?.name ?? "Service"}
          </p>
          {booking.package && (
            <p className="font-dm text-xs" style={{ color: `${SADDLE}65` }}>
              {booking.package.name}
            </p>
          )}
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="flex items-center gap-4 text-xs font-dm" style={{ color: `${SADDLE}70` }}>
        <span className="flex items-center gap-1.5">
          <Calendar size={11} /> {eventDate}
        </span>
        {booking.quotedPrice != null && (
          <span className="font-semibold" style={{ color: TEAL }}>
            ₹{Number(booking.quotedPrice).toLocaleString("en-IN")}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-wider" style={{ color: `${SADDLE}45` }}>
          {booking.bookingNumber}
        </span>
        <Link
          href={`/bookings/track/${booking.bookingNumber}`}
          className="flex items-center gap-1 font-cinzel text-[9px] tracking-[0.2em] uppercase transition-opacity hover:opacity-60"
          style={{ color: TEAL }}
        >
          Track <ChevronRight size={11} />
        </Link>
      </div>
    </motion.div>
  );
}

export default function ProfilePage() {
  const { user, isLoading, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const reduced = useReducedMotion();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.push("/login?from=/profile");
  }, [isLoading, isLoggedIn, router]);

  useEffect(() => {
    if (!isLoggedIn) return;
    bookingsApi.myBookings()
      .then(setBookings)
      .catch((e) => setBookingsError(e instanceof Error ? e.message : "Failed to load bookings"))
      .finally(() => setBookingsLoading(false));
  }, [isLoggedIn]);

  if (isLoading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #EDFAFA 0%, #C8EEEE 100%)" }}>
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </main>
    );
  }

  const fields = [
    { icon: User, label: "Full Name", value: user.name },
    { icon: Mail, label: "Email", value: user.email },
    { icon: Shield, label: "Role", value: user.role === "admin" ? "Administrator" : "Customer" },
    {
      icon: Calendar, label: "Member Since",
      value: new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }),
    },
  ];

  return (
    <main
      className="min-h-screen px-4 py-20 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #EDFAFA 0%, #C8EEEE 100%)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 60% 50% at 50% 30%, ${TUSCAN}10 0%, transparent 70%)` }}
      />

      <div className="container-max relative z-10">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start"
        >
          {/* ── Left: profile card ── */}
          <div className="lg:col-span-2">
            <div
              className="glass-card rounded-2xl p-8 sticky top-28"
              style={{ border: `1px solid ${TUSCAN}28` }}
            >
              {/* Avatar */}
              <div className="flex flex-col items-center mb-8">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center font-playfair text-3xl font-bold mb-4"
                  style={{ background: TUSCAN, color: "#020608" }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-cinzel text-[9px] tracking-[0.35em] uppercase text-primary mb-1">
                  Your Profile
                </span>
                <h1 className="font-playfair text-2xl font-bold text-light">{user.name}</h1>
              </div>

              <div className="space-y-3 mb-8">
                {fields.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl"
                    style={{ background: `${TUSCAN}08`, border: `1px solid ${TUSCAN}15` }}
                  >
                    <Icon size={15} style={{ color: TUSCAN, flexShrink: 0 }} />
                    <div>
                      <p className="font-cinzel text-[8px] tracking-[0.3em] uppercase mb-0.5" style={{ color: `${SADDLE}70` }}>
                        {label}
                      </p>
                      <p className="font-dm text-sm text-light">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={async () => { await logout(); router.push("/"); }}
                className="w-full py-3 rounded-xl font-cinzel text-[9px] tracking-[0.3em] uppercase transition-all"
                style={{ border: "1px solid rgba(185,28,28,0.3)", color: "#b91c1c", background: "rgba(239,68,68,0.04)" }}
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* ── Right: my bookings ── */}
          <div className="lg:col-span-3">
            <div className="glass-card rounded-2xl p-6 md:p-8" style={{ border: `1px solid ${TUSCAN}28` }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="font-cinzel text-[9px] tracking-[0.35em] uppercase text-primary block mb-1">
                    History
                  </span>
                  <h2 className="font-playfair text-2xl font-bold text-light">My Bookings</h2>
                </div>
                <CalendarCheck size={22} style={{ color: TUSCAN }} />
              </div>

              {bookingsLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
              )}

              {!bookingsLoading && bookingsError && (
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-dm text-sm"
                  style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)", color: "#b91c1c" }}
                >
                  <AlertCircle size={15} className="flex-shrink-0" />
                  {bookingsError}
                </div>
              )}

              {!bookingsLoading && !bookingsError && bookings.length === 0 && (
                <div className="text-center py-12">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: `${TUSCAN}12` }}
                  >
                    <CalendarCheck size={22} style={{ color: TUSCAN }} />
                  </div>
                  <p className="font-playfair text-lg font-semibold mb-1" style={{ color: SADDLE }}>No bookings yet</p>
                  <p className="font-dm text-sm mb-5" style={{ color: `${SADDLE}60` }}>
                    Your confirmed bookings will appear here.
                  </p>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full font-cinzel text-[9px] tracking-[0.25em] uppercase transition-all hover:opacity-80"
                    style={{ background: TUSCAN, color: "#020608" }}
                  >
                    Browse Services <ChevronRight size={12} />
                  </Link>
                </div>
              )}

              {!bookingsLoading && !bookingsError && bookings.length > 0 && (
                <div className="space-y-3">
                  {bookings.map((b) => (
                    <BookingCard key={b.id} booking={b} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
