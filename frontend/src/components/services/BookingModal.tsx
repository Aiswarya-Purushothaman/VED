"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  X, MapPin, User, Phone, Mail, ChevronRight,
  ChevronLeft, CheckCircle2, Sparkles, AlertCircle, Copy, Check,
  ChevronLeft as PrevMonth, ChevronRight as NextMonth,
} from "lucide-react";
import { bookingsApi, type Service, type ServicePackage } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const SADDLE = "#84572F";
const TUSCAN = "#F1A805";
const TEAL = "#00A693";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface Props {
  service: Service;
  preSelectedPackage?: ServicePackage | null;
  onClose: () => void;
}

type Step = "details" | "contact" | "success";

// ── Mini calendar ──────────────────────────────────────────────────────────
function DatePicker({ value, onChange }: { value: string; onChange: (d: string) => void }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [cursor, setCursor] = useState(() => {
    const base = value ? new Date(value + "T00:00:00") : new Date();
    return { year: base.getFullYear(), month: base.getMonth() };
  });

  const selected = value ? new Date(value + "T00:00:00") : null;

  const days = useMemo(() => {
    const first = new Date(cursor.year, cursor.month, 1);
    const last = new Date(cursor.year, cursor.month + 1, 0);
    const cells: (Date | null)[] = [];
    for (let i = 0; i < first.getDay(); i++) cells.push(null);
    for (let d = 1; d <= last.getDate(); d++) cells.push(new Date(cursor.year, cursor.month, d));
    return cells;
  }, [cursor]);

  function prevMonth() {
    setCursor((c) => {
      const m = c.month === 0 ? 11 : c.month - 1;
      const y = c.month === 0 ? c.year - 1 : c.year;
      return { year: y, month: m };
    });
  }
  function nextMonth() {
    setCursor((c) => {
      const m = c.month === 11 ? 0 : c.month + 1;
      const y = c.month === 11 ? c.year + 1 : c.year;
      return { year: y, month: m };
    });
  }

  function select(date: Date) {
    if (date < today) return;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    onChange(`${y}-${m}-${d}`);
  }

  const canGoPrev =
    cursor.year > today.getFullYear() ||
    (cursor.year === today.getFullYear() && cursor.month > today.getMonth());

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${TUSCAN}25` }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: `${TUSCAN}08` }}
      >
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-colors disabled:opacity-25 hover:bg-amber-100"
          style={{ color: SADDLE }}
        >
          <PrevMonth size={14} />
        </button>
        <span className="font-cinzel text-[11px] tracking-[0.25em] uppercase" style={{ color: SADDLE }}>
          {MONTHS[cursor.month]} {cursor.year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-amber-100"
          style={{ color: SADDLE }}
        >
          <NextMonth size={14} />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 border-b" style={{ borderColor: `${TUSCAN}15` }}>
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center py-2 font-cinzel text-[9px] tracking-[0.15em] uppercase"
            style={{ color: `${SADDLE}50` }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 p-2 gap-0.5">
        {days.map((date, i) => {
          if (!date) return <div key={`e-${i}`} />;
          const isPast = date < today;
          const isToday = date.toDateString() === today.toDateString();
          const isSel = selected && date.toDateString() === selected.toDateString();
          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={isPast}
              onClick={() => select(date)}
              className="aspect-square rounded-xl flex items-center justify-center font-dm text-sm transition-all duration-150"
              style={{
                background: isSel ? TUSCAN : isToday ? `${TUSCAN}15` : "transparent",
                color: isSel ? "#020608" : isPast ? `${SADDLE}25` : SADDLE,
                fontWeight: isSel || isToday ? 700 : 400,
                cursor: isPast ? "not-allowed" : "pointer",
              }}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Selected label */}
      {selected && (
        <div
          className="px-4 py-2.5 text-center font-cinzel text-[10px] tracking-[0.25em] uppercase border-t"
          style={{ borderColor: `${TUSCAN}15`, color: TEAL }}
        >
          {selected.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function BookingModal({ service, preSelectedPackage, onClose }: Props) {
  const reduced = useReducedMotion();
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();

  const [step, setStep] = useState<Step>("details");
  const [selectedPkg, setSelectedPkg] = useState<ServicePackage | null>(preSelectedPackage ?? null);
  const [eventDate, setEventDate] = useState("");
  const [venue, setVenue] = useState("");
  const [addons, setAddons] = useState<string[]>([]);
  const [specialNotes, setSpecialNotes] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingNumber, setBookingNumber] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const toggleAddon = useCallback((addonName: string) => {
    setAddons((prev) =>
      prev.includes(addonName) ? prev.filter((a) => a !== addonName) : [...prev, addonName]
    );
  }, []);

  const step1Valid = !!eventDate && venue.trim().length > 0;
  const step2Valid = name.trim().length > 0 && phone.trim().length >= 10 && email.includes("@");

  async function handleSubmit() {
    if (!step2Valid) return;
    setError(null);
    setSubmitting(true);
    try {
      const result = await bookingsApi.create({
        serviceId: service.id,
        packageId: selectedPkg?.id,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim(),
        eventDate,
        venue: venue.trim(),
        requestedAddons: addons,
        specialNotes: specialNotes.trim() || undefined,
      });
      setBookingNumber(result.bookingNumber);
      setStep("success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function copyBookingNumber() {
    await navigator.clipboard.writeText(bookingNumber).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Auth gate ──────────────────────────────────────────────────────────
  if (!isLoading && !isLoggedIn) {
    return (
      <Overlay onClose={onClose} reduced={!!reduced}>
        <div className="text-center py-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: `${TUSCAN}15` }}
          >
            <User size={24} style={{ color: TUSCAN }} />
          </div>
          <h2 className="font-playfair text-2xl font-bold mb-2" style={{ color: SADDLE }}>
            Sign in to Book
          </h2>
          <p className="font-dm text-sm mb-8" style={{ color: `${SADDLE}70` }}>
            Please sign in to confirm your booking for <strong>{service.name}</strong>.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push(`/login?from=/services/${service.slug}`)}
              className="w-full py-3.5 rounded-full font-cinzel text-[10px] tracking-[0.3em] uppercase transition-all"
              style={{ background: TUSCAN, color: "#020608" }}
            >
              Sign In
            </button>
            <button
              onClick={() => router.push(`/register?from=/services/${service.slug}`)}
              className="w-full py-3.5 rounded-full font-cinzel text-[10px] tracking-[0.3em] uppercase border transition-all hover:bg-amber-50"
              style={{ borderColor: `${TUSCAN}40`, color: SADDLE }}
            >
              Create Account
            </button>
          </div>
        </div>
      </Overlay>
    );
  }

  // ── Success ────────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <Overlay onClose={onClose} reduced={!!reduced}>
        <motion.div
          initial={reduced ? false : { scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="text-center py-2"
        >
          <motion.div
            initial={reduced ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 20 }}
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: `${TEAL}15` }}
          >
            <CheckCircle2 size={32} style={{ color: TEAL }} />
          </motion.div>
          <h2 className="font-playfair text-2xl font-bold mb-2" style={{ color: SADDLE }}>
            Booking Received!
          </h2>
          <p className="font-dm text-sm mb-6" style={{ color: `${SADDLE}70` }}>
            Your request for <strong>{service.name}</strong> on{" "}
            <strong>{new Date(eventDate + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</strong>{" "}
            has been submitted. We&apos;ll confirm within 2 hours.
          </p>

          <div
            className="rounded-2xl px-6 py-4 mb-6"
            style={{ background: `${TUSCAN}08`, border: `1px solid ${TUSCAN}20` }}
          >
            <p className="font-cinzel text-[9px] tracking-[0.3em] uppercase mb-2" style={{ color: `${SADDLE}60` }}>
              Booking Number
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono text-lg font-bold tracking-widest" style={{ color: SADDLE }}>
                {bookingNumber}
              </span>
              <button
                onClick={copyBookingNumber}
                className="p-1.5 rounded-lg transition-colors hover:bg-amber-100"
                style={{ color: `${SADDLE}80` }}
                aria-label="Copy booking number"
              >
                {copied ? <Check size={14} style={{ color: TEAL }} /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <p className="font-dm text-xs mb-6" style={{ color: `${SADDLE}50` }}>
            Save this number to track your booking status.
          </p>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-full font-cinzel text-[10px] tracking-[0.3em] uppercase transition-all"
            style={{ background: TUSCAN, color: "#020608" }}
          >
            Done
          </button>
        </motion.div>
      </Overlay>
    );
  }

  return (
    <Overlay onClose={onClose} reduced={!!reduced}>
      {/* Step progress */}
      <div className="flex items-center gap-2 mb-6">
        {(["details", "contact"] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-cinzel transition-all duration-300 flex-shrink-0"
              style={{
                background: step === s ? TUSCAN : step === "contact" && s === "details" ? `${TUSCAN}30` : `${TUSCAN}12`,
                color: step === s ? "#020608" : SADDLE,
              }}
            >
              {step === "contact" && s === "details" ? <Check size={11} /> : i + 1}
            </div>
            <span
              className="font-cinzel text-[9px] tracking-[0.2em] uppercase hidden sm:block"
              style={{ color: step === s ? SADDLE : `${SADDLE}45` }}
            >
              {s === "details" ? "Date & Event" : "Your Details"}
            </span>
            {i < 1 && <div className="flex-1 h-px mx-1" style={{ background: `${TUSCAN}20` }} />}
          </div>
        ))}
      </div>

      {/* ── Step 1 ───────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {step === "details" && (
          <motion.div
            key="details"
            initial={reduced ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? {} : { opacity: 0, x: -24 }}
            transition={{ duration: 0.22 }}
            className="space-y-5"
          >
            <div>
              <p className="font-cinzel text-[9px] tracking-[0.3em] uppercase mb-1" style={{ color: `${SADDLE}55` }}>
                {service.name}
              </p>
              <h3 className="font-playfair text-xl font-bold" style={{ color: SADDLE }}>
                Choose Your Date
              </h3>
            </div>

            {/* Calendar */}
            <DatePicker value={eventDate} onChange={setEventDate} />

            {/* Package */}
            {service.packages.length > 0 && (
              <div>
                <label className="font-cinzel text-[9px] tracking-[0.25em] uppercase block mb-2" style={{ color: `${SADDLE}70` }}>
                  Package <span style={{ color: `${SADDLE}35` }}>(optional)</span>
                </label>
                <div className="space-y-1.5">
                  {service.packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPkg(selectedPkg?.id === pkg.id ? null : pkg)}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-left transition-all duration-150"
                      style={{
                        border: `1.5px solid ${selectedPkg?.id === pkg.id ? TUSCAN : `${TUSCAN}22`}`,
                        background: selectedPkg?.id === pkg.id ? `${TUSCAN}08` : "transparent",
                      }}
                    >
                      <div>
                        <span className="font-dm text-sm font-semibold" style={{ color: SADDLE }}>{pkg.name}</span>
                        {pkg.price != null && (
                          <span className="font-dm text-xs ml-2" style={{ color: `${SADDLE}55` }}>
                            ₹{Number(pkg.price).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                      <div
                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={{ borderColor: selectedPkg?.id === pkg.id ? TUSCAN : `${SADDLE}28` }}
                      >
                        {selectedPkg?.id === pkg.id && (
                          <div className="w-2 h-2 rounded-full" style={{ background: TUSCAN }} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Venue */}
            <div>
              <label className="font-cinzel text-[9px] tracking-[0.25em] uppercase block mb-2" style={{ color: `${SADDLE}70` }}>
                Venue <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div
                className="flex items-center gap-3 border rounded-xl px-4 py-3 transition-all"
                style={{ borderColor: venue ? TUSCAN : `${TUSCAN}28` }}
              >
                <MapPin size={15} style={{ color: `${SADDLE}55` }} />
                <input
                  type="text"
                  placeholder="e.g. The Leela Palace, Bangalore"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="flex-1 font-dm text-sm outline-none bg-transparent"
                  style={{ color: SADDLE }}
                />
              </div>
            </div>

            {/* Add-ons */}
            {service.addons.length > 0 && (
              <div>
                <label className="font-cinzel text-[9px] tracking-[0.25em] uppercase block mb-2" style={{ color: `${SADDLE}70` }}>
                  Add-Ons
                </label>
                <div className="flex flex-wrap gap-2">
                  {service.addons.map((addon) => {
                    const on = addons.includes(addon.name);
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => toggleAddon(addon.name)}
                        className="px-3 py-1.5 rounded-full font-cinzel text-[9px] tracking-[0.18em] uppercase transition-all duration-150"
                        style={{
                          background: on ? `${TUSCAN}18` : "transparent",
                          border: `1px solid ${on ? TUSCAN : `${TUSCAN}28`}`,
                          color: on ? SADDLE : `${SADDLE}60`,
                        }}
                      >
                        {on && "✓ "}{addon.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              onClick={() => setStep("contact")}
              disabled={!step1Valid}
              className="w-full py-3.5 rounded-full font-cinzel text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-35 disabled:cursor-not-allowed"
              style={{ background: TUSCAN, color: "#020608" }}
            >
              Continue <ChevronRight size={14} />
            </button>
          </motion.div>
        )}

        {/* ── Step 2 ────────────────────────────────────────── */}
        {step === "contact" && (
          <motion.div
            key="contact"
            initial={reduced ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? {} : { opacity: 0, x: -24 }}
            transition={{ duration: 0.22 }}
            className="space-y-4"
          >
            <div>
              <h3 className="font-playfair text-xl font-bold" style={{ color: SADDLE }}>
                Your Details
              </h3>
              <p className="font-dm text-xs mt-0.5" style={{ color: `${SADDLE}55` }}>
                We&apos;ll use these to confirm and coordinate your event.
              </p>
            </div>

            {/* Summary pill */}
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: `${TUSCAN}07`, border: `1px solid ${TUSCAN}18` }}
            >
              <Sparkles size={13} style={{ color: TUSCAN }} />
              <div className="flex-1 min-w-0">
                <p className="font-dm text-xs font-semibold truncate" style={{ color: SADDLE }}>
                  {service.name}{selectedPkg ? ` · ${selectedPkg.name}` : ""}
                </p>
                <p className="font-dm text-xs truncate" style={{ color: `${SADDLE}55` }}>
                  {new Date(eventDate + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {venue}
                </p>
              </div>
              <button
                onClick={() => setStep("details")}
                className="font-cinzel text-[8px] tracking-[0.2em] uppercase flex-shrink-0 hover:opacity-60 transition-opacity"
                style={{ color: TEAL }}
              >
                Edit
              </button>
            </div>

            <InputRow icon={<User size={14} style={{ color: `${SADDLE}55` }} />} label="Full Name" required active={!!name}>
              <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)}
                className="flex-1 font-dm text-sm outline-none bg-transparent" style={{ color: SADDLE }} />
            </InputRow>

            <InputRow icon={<Phone size={14} style={{ color: `${SADDLE}55` }} />} label="Phone Number" required active={phone.length >= 10}>
              <input type="tel" placeholder="10-digit mobile" value={phone} maxLength={13}
                onChange={(e) => setPhone(e.target.value.replace(/[^\d+]/g, ""))}
                className="flex-1 font-dm text-sm outline-none bg-transparent" style={{ color: SADDLE }} />
            </InputRow>

            <InputRow icon={<Mail size={14} style={{ color: `${SADDLE}55` }} />} label="Email Address" required active={email.includes("@")}>
              <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                className="flex-1 font-dm text-sm outline-none bg-transparent" style={{ color: SADDLE }} />
            </InputRow>

            <div>
              <label className="font-cinzel text-[9px] tracking-[0.25em] uppercase block mb-2" style={{ color: `${SADDLE}70` }}>
                Special Requests <span style={{ color: `${SADDLE}35` }}>(optional)</span>
              </label>
              <textarea rows={3} placeholder="Theme preferences, special requirements…" value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 font-dm text-sm outline-none resize-none transition-all"
                style={{ borderColor: specialNotes ? TUSCAN : `${TUSCAN}28`, color: SADDLE, background: "transparent" }} />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={reduced ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl font-dm text-sm"
                  style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)", color: "#b91c1c" }}
                >
                  <AlertCircle size={14} className="flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setStep("details")}
                className="flex items-center gap-1.5 px-5 py-3.5 rounded-full font-cinzel text-[10px] tracking-[0.25em] uppercase border transition-all hover:bg-amber-50 flex-shrink-0"
                style={{ borderColor: `${TUSCAN}28`, color: SADDLE }}
              >
                <ChevronLeft size={13} /> Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!step2Valid || submitting}
                className="flex-1 py-3.5 rounded-full font-cinzel text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-35 disabled:cursor-not-allowed"
                style={{ background: TUSCAN, color: "#020608" }}
              >
                {submitting ? (
                  <><span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" /> Submitting…</>
                ) : "Confirm Booking"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Overlay>
  );
}

// ── Shared helpers ─────────────────────────────────────────────────────────

function Overlay({ children, onClose, reduced }: { children: React.ReactNode; onClose: () => void; reduced: boolean }) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(2,6,8,0.65)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduced ? {} : { opacity: 0, y: 60 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="relative w-full sm:max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-7 sm:p-8"
        style={{ background: "#FFFBF5", border: `1px solid ${TUSCAN}18` }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-amber-100"
          style={{ color: `${SADDLE}65` }}
          aria-label="Close"
        >
          <X size={16} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}

function InputRow({ icon, label, required, active, children }: {
  icon: React.ReactNode; label: string; required?: boolean; active?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="font-cinzel text-[9px] tracking-[0.25em] uppercase block mb-2" style={{ color: `${SADDLE}70` }}>
        {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      <div className="flex items-center gap-3 border rounded-xl px-4 py-3 transition-all"
        style={{ borderColor: active ? TUSCAN : `${TUSCAN}28` }}>
        {icon}
        {children}
      </div>
    </div>
  );
}
