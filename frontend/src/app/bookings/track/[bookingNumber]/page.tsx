"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Search, CalendarCheck, MapPin, Package, Sparkles,
  CheckCircle2, Clock, Loader2, XCircle, ChevronRight,
  Copy, Check, AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { bookingsApi, type Booking } from "@/lib/api";

const SADDLE = "#84572F";
const TUSCAN = "#F1A805";
const TEAL = "#00A693";

type BookingStatus = Booking["status"];

const STEPS: { key: BookingStatus; label: string; desc: string }[] = [
  { key: "pending",     label: "Pending",     desc: "Awaiting our team to review your request." },
  { key: "confirmed",   label: "Confirmed",   desc: "Your booking is confirmed! We'll be in touch soon." },
  { key: "in_progress", label: "Decorating",  desc: "Our team is setting up your event." },
  { key: "completed",   label: "Completed",   desc: "Your event is done. Thank you!" },
];

const STATUS_ORDER: Record<BookingStatus, number> = {
  pending: 0, confirmed: 1, in_progress: 2, completed: 3, cancelled: -1,
};

function StatusTimeline({ status }: { status: BookingStatus }) {
  if (status === "cancelled") {
    return (
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl font-dm text-sm"
        style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)", color: "#b91c1c" }}
      >
        <XCircle size={16} className="flex-shrink-0" />
        This booking has been cancelled. Please contact us for assistance.
      </div>
    );
  }

  const current = STATUS_ORDER[status];

  return (
    <div className="space-y-0">
      {STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const upcoming = i > current;
        return (
          <div key={step.key} className="flex gap-4">
            {/* Track line + dot */}
            <div className="flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500"
                style={{
                  background: done ? TEAL : active ? TUSCAN : `${SADDLE}12`,
                  border: active ? `2px solid ${TUSCAN}` : "none",
                }}
              >
                {done && <CheckCircle2 size={14} color="#fff" />}
                {active && (status === "in_progress"
                  ? <Loader2 size={14} color="#020608" className="animate-spin" />
                  : <Clock size={14} color="#020608" />
                )}
                {upcoming && <div className="w-2 h-2 rounded-full" style={{ background: `${SADDLE}30` }} />}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="w-0.5 flex-1 my-1 min-h-[24px] transition-colors duration-500"
                  style={{ background: done ? TEAL : `${SADDLE}15` }}
                />
              )}
            </div>

            {/* Label */}
            <div className={`pb-5 ${i === STEPS.length - 1 ? "pb-0" : ""}`}>
              <p
                className="font-cinzel text-[10px] tracking-[0.2em] uppercase font-semibold"
                style={{ color: done || active ? SADDLE : `${SADDLE}35` }}
              >
                {step.label}
              </p>
              {(done || active) && (
                <p className="font-dm text-xs mt-0.5" style={{ color: `${SADDLE}60` }}>
                  {step.desc}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BookingDetail({ booking }: { booking: Booking }) {
  const [copied, setCopied] = useState(false);
  const reduced = useReducedMotion();

  const eventDate = new Date(booking.eventDate + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  async function copy() {
    await navigator.clipboard.writeText(booking.bookingNumber).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const details = [
    { icon: <CalendarCheck size={14} style={{ color: TUSCAN }} />, label: "Event Date", value: eventDate },
    { icon: <MapPin size={14} style={{ color: TUSCAN }} />, label: "Venue", value: booking.venue },
    ...(booking.package ? [{ icon: <Package size={14} style={{ color: TUSCAN }} />, label: "Package", value: booking.package.name }] : []),
    ...(booking.requestedAddons?.length
      ? [{ icon: <Sparkles size={14} style={{ color: TUSCAN }} />, label: "Add-Ons", value: booking.requestedAddons.join(", ") }]
      : []),
    ...(booking.quotedPrice != null
      ? [{ icon: <span className="font-bold text-xs" style={{ color: TUSCAN }}>₹</span>, label: "Quoted Price", value: `₹${Number(booking.quotedPrice).toLocaleString("en-IN")}` }]
      : []),
    ...(booking.adminNotes
      ? [{ icon: <AlertCircle size={14} style={{ color: TUSCAN }} />, label: "Note from Us", value: booking.adminNotes }]
      : []),
  ];

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      {/* Header */}
      {/* <div
        className="rounded-2xl px-6 py-5 flex items-center justify-between gap-4"
        style={{ background: `${TUSCAN}08`, border: `1px solid ${TUSCAN}20` }}
      >
        <div>
          <p className="font-cinzel text-[9px] tracking-[0.3em] uppercase mb-1" style={{ color: `${SADDLE}60` }}>Booking Number</p>
          <span className="font-mono text-lg font-bold tracking-wider" style={{ color: SADDLE }}>
            {booking.bookingNumber}
          </span>
        </div>
        <button
          onClick={copy}
          className="p-2 rounded-xl transition-colors hover:bg-amber-100"
          style={{ color: `${SADDLE}70` }}
          aria-label="Copy booking number"
        >
          {copied ? <Check size={16} style={{ color: TEAL }} /> : <Copy size={16} />}
        </button>
      </div> */}

      {/* Service name */}
      <div>
        <p className="font-cinzel text-[9px] tracking-[0.3em] uppercase mb-1" style={{ color: `${SADDLE}55` }}>Service</p>
        <h2 className="font-playfair text-2xl font-bold" style={{ color: SADDLE }}>
          {booking.service?.name ?? "Event Service"}
        </h2>
      </div>

      {/* Status timeline */}
      <div>
        <p className="font-cinzel text-[9px] tracking-[0.3em] uppercase mb-4" style={{ color: `${SADDLE}55` }}>Status</p>
        <StatusTimeline status={booking.status} />
      </div>

      {/* Details grid */}
      <div className="space-y-2.5">
        <p className="font-cinzel text-[9px] tracking-[0.3em] uppercase" style={{ color: `${SADDLE}55` }}>Details</p>
        {details.map(({ icon, label, value }) => (
          <div
            key={label}
            className="flex items-start gap-3 px-4 py-3 rounded-xl"
            style={{ background: `${TUSCAN}06`, border: `1px solid ${TUSCAN}15` }}
          >
            <span className="mt-0.5 flex-shrink-0">{icon}</span>
            <div>
              <p className="font-cinzel text-[8px] tracking-[0.25em] uppercase mb-0.5" style={{ color: `${SADDLE}60` }}>{label}</p>
              <p className="font-dm text-sm" style={{ color: SADDLE }}>{value}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function TrackPage({ params }: { params: { bookingNumber: string } }) {
  const reduced = useReducedMotion();
  const [input, setInput] = useState(params.bookingNumber ?? "");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (params.bookingNumber) track(params.bookingNumber);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function track(number = input) {
    const bn = number.trim().toUpperCase();
    if (!bn) return;
    setLoading(true);
    setError(null);
    setBooking(null);
    setSearched(true);
    try {
      const result = await bookingsApi.track(bn);
      setBooking(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Booking not found.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen px-4 py-20 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #EDFAFA 0%, #C8EEEE 100%)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 60% 50% at 50% 30%, ${TUSCAN}10 0%, transparent 70%)` }}
      />

      <div className="container-max relative z-10 max-w-xl mx-auto">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card rounded-2xl p-8 md:p-10"
          style={{ border: `1px solid ${TUSCAN}28` }}
        >
          {/* Title */}
          <div className="mb-8">
            <span className="font-cinzel text-[9px] tracking-[0.35em] uppercase text-primary block mb-1">
              Booking Status
            </span>
            <h1 className="font-playfair text-3xl font-bold text-light">Track Your Booking</h1>
          </div>

          {/* Search bar */}
          <div className="flex gap-2 mb-8">
            <div
              className="flex items-center gap-3 flex-1 border rounded-xl px-4 py-3 transition-all"
              style={{ borderColor: input ? TUSCAN : `${TUSCAN}28` }}
            >
              <Search size={15} style={{ color: `${SADDLE}55`, flexShrink: 0 }} />
              <input
                type="text"
                placeholder="e.g. VED-ABC123-XY12"
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && track()}
                className="flex-1 font-mono text-sm outline-none bg-transparent tracking-wider"
                style={{ color: SADDLE }}
              />
            </div>
            <button
              onClick={() => track()}
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl font-cinzel text-[9px] tracking-[0.25em] uppercase flex items-center gap-1.5 transition-all disabled:opacity-35 disabled:cursor-not-allowed"
              style={{ background: TUSCAN, color: "#020608" }}
            >
              {loading
                ? <Loader2 size={14} className="animate-spin" />
                : <><Search size={13} /> Track</>
              }
            </button>
          </div>

          {/* Error */}
          {searched && error && !loading && (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-dm text-sm mb-6"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)", color: "#b91c1c" }}
            >
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Result */}
          {booking && !loading && <BookingDetail booking={booking} />}

          {/* Empty state (before first search) */}
          {!searched && !loading && (
            <div className="text-center py-6">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: `${TUSCAN}12` }}
              >
                <CalendarCheck size={22} style={{ color: TUSCAN }} />
              </div>
              <p className="font-dm text-sm" style={{ color: `${SADDLE}60` }}>
                Enter your booking number above to see its current status.
              </p>
            </div>
          )}

          {/* Footer link */}
          <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: `${TUSCAN}15` }}>
            <Link
              href="/profile"
              className="inline-flex items-center gap-1 font-cinzel text-[9px] tracking-[0.2em] uppercase transition-opacity hover:opacity-60"
              style={{ color: TEAL }}
            >
              <ChevronRight size={11} className="rotate-180" /> Back to Profile
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
