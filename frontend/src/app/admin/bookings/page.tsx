"use client";
import { useEffect, useState, useCallback } from "react";
import { bookingsApi, type Booking } from "@/lib/api";
import { BookingsSkeleton } from "../_components/Skeletons";
import { ChevronDown, IndianRupee, StickyNote } from "lucide-react";

const SADDLE = "#84572F";
const TUSCAN = "#F1A805";

const STATUS_OPTIONS = ["pending", "confirmed", "in_progress", "completed", "cancelled"] as const;
const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B", confirmed: "#3B82F6", in_progress: "#8B5CF6",
  completed: "#10B981", cancelled: "#EF4444",
};

function Badge({ status }: { status: string }) {
  return (
    <span className="px-2.5 py-1 rounded-full font-cinzel text-[11px] tracking-[0.2em] uppercase whitespace-nowrap"
      style={{ background: `${STATUS_COLORS[status]}15`, color: STATUS_COLORS[status] }}>
      {status.replace("_", " ")}
    </span>
  );
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<Record<string, string>>({});
  const [editNotes, setEditNotes] = useState<Record<string, string>>({});

  const load = useCallback(() => {
    setLoading(true);
    bookingsApi.adminList(filter || undefined)
      .then(setBookings)
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id: string, status: string) {
    setSaving(id);
    await bookingsApi.adminUpdate(id, { status }).catch(() => {});
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: status as Booking["status"] } : b));
    setSaving(null);
  }

  async function saveQuote(id: string) {
    setSaving(id);
    const price = parseFloat(editPrice[id] ?? "");
    const notes = editNotes[id] ?? "";
    await bookingsApi.adminUpdate(id, {
      ...(isNaN(price) ? {} : { quotedPrice: price }),
      ...(notes ? { adminNotes: notes } : {}),
    }).catch(() => {});
    setBookings((prev) => prev.map((b) => b.id === id ? {
      ...b,
      ...(isNaN(price) ? {} : { quotedPrice: price }),
      ...(notes ? { adminNotes: notes } : {}),
    } : b));
    setSaving(null);
    setExpanded(null);
  }

  const shown = bookings;

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 items-center">
        {["", ...STATUS_OPTIONS].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className="px-4 py-2 rounded-full font-cinzel text-[11px] tracking-[0.25em] uppercase transition-all"
            style={{
              background: filter === s ? TUSCAN : `${TUSCAN}10`,
              color: filter === s ? "#020608" : SADDLE,
            }}>
            {s === "" ? "All" : s.replace("_", " ")}
          </button>
        ))}
        <span className="ml-auto font-dm text-xs" style={{ color: `${SADDLE}60` }}>{shown.length} bookings</span>
      </div>

      {loading ? (
        <BookingsSkeleton />
      ) : shown.length === 0 ? (
        <p className="text-center py-16 font-dm text-sm" style={{ color: `${SADDLE}60` }}>No bookings found.</p>
      ) : (
        <div className="space-y-3">
          {shown.map((b) => (
            <div key={b.id} className="rounded-2xl overflow-hidden"
              style={{ background: "#fff", border: `1px solid ${TUSCAN}15`, boxShadow: `0 2px 8px ${TUSCAN}06` }}>
              {/* Row */}
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-dm text-sm font-semibold" style={{ color: SADDLE }}>{b.customerName}</p>
                    <Badge status={b.status} />
                    {b.quotedPrice && (
                      <span className="font-cinzel text-[11px] tracking-[0.2em]" style={{ color: "#10B981" }}>
                        ₹{Number(b.quotedPrice).toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  <p className="font-dm text-xs mt-0.5 truncate" style={{ color: `${SADDLE}60` }}>
                    {b.service?.name} · {b.package?.name ?? "No plan"} · {b.bookingNumber}
                  </p>
                  <p className="font-dm text-xs mt-0.5" style={{ color: `${SADDLE}50` }}>
                    📅 {b.eventDate} · 📍 {b.venue}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Quick status change */}
                  <div className="relative">
                    <select
                      value={b.status}
                      disabled={saving === b.id}
                      onChange={(e) => updateStatus(b.id, e.target.value)}
                      className="appearance-none pl-3 pr-7 py-1.5 rounded-lg font-dm text-xs border cursor-pointer disabled:opacity-50"
                      style={{ borderColor: `${TUSCAN}30`, color: SADDLE, background: `${TUSCAN}05` }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.replace("_", " ")}</option>
                      ))}
                    </select>
                    <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: SADDLE }} />
                  </div>
                  <button onClick={() => setExpanded(expanded === b.id ? null : b.id)}
                    className="p-2 rounded-lg transition-colors hover:bg-amber-50"
                    style={{ border: `1px solid ${TUSCAN}20`, color: SADDLE }}>
                    <StickyNote size={14} />
                  </button>
                </div>
              </div>

              {/* Expanded panel */}
              {expanded === b.id && (
                <div className="border-t px-5 py-4 space-y-4" style={{ borderColor: `${TUSCAN}10`, background: "#FFFBF5" }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-dm" style={{ color: SADDLE }}>
                    <div>
                      <p className="font-cinzel text-[11px] tracking-[0.25em] uppercase mb-1" style={{ color: `${SADDLE}60` }}>Customer</p>
                      <p>{b.customerPhone} · {b.customerEmail}</p>
                    </div>
                    {b.requestedAddons?.length > 0 && (
                      <div>
                        <p className="font-cinzel text-[11px] tracking-[0.25em] uppercase mb-1" style={{ color: `${SADDLE}60` }}>Requested Add-ons</p>
                        <p>{b.requestedAddons.join(", ")}</p>
                      </div>
                    )}
                    {b.specialNotes && (
                      <div className="md:col-span-2">
                        <p className="font-cinzel text-[11px] tracking-[0.25em] uppercase mb-1" style={{ color: `${SADDLE}60` }}>Special Notes</p>
                        <p>{b.specialNotes}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 items-end">
                    <div>
                      <label className="font-cinzel text-[11px] tracking-[0.25em] uppercase block mb-1" style={{ color: `${SADDLE}70` }}>
                        Quoted Price (₹)
                      </label>
                      <div className="flex items-center gap-1 border rounded-lg px-3 py-2" style={{ borderColor: `${TUSCAN}30` }}>
                        <IndianRupee size={12} style={{ color: `${SADDLE}60` }} />
                        <input type="number" placeholder={b.quotedPrice?.toString() ?? "Enter amount"}
                          value={editPrice[b.id] ?? ""}
                          onChange={(e) => setEditPrice((p) => ({ ...p, [b.id]: e.target.value }))}
                          className="w-28 font-dm text-sm outline-none bg-transparent" style={{ color: SADDLE }} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-48">
                      <label className="font-cinzel text-[11px] tracking-[0.25em] uppercase block mb-1" style={{ color: `${SADDLE}70` }}>
                        Admin Notes
                      </label>
                      <input type="text" placeholder={b.adminNotes ?? "Add internal notes…"}
                        value={editNotes[b.id] ?? ""}
                        onChange={(e) => setEditNotes((p) => ({ ...p, [b.id]: e.target.value }))}
                        className="w-full border rounded-lg px-3 py-2 font-dm text-sm outline-none"
                        style={{ borderColor: `${TUSCAN}30`, color: SADDLE }} />
                    </div>
                    <button onClick={() => saveQuote(b.id)} disabled={saving === b.id}
                      className="px-5 py-2 rounded-lg font-cinzel text-[11px] tracking-[0.25em] uppercase transition-all disabled:opacity-50"
                      style={{ background: TUSCAN, color: "#020608" }}>
                      {saving === b.id ? "Saving…" : "Save"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
