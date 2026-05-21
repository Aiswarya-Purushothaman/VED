"use client";
import { useEffect, useState } from "react";
import { reviewsApi, type Review } from "@/lib/api";
import { ReviewsSkeleton } from "../_components/Skeletons";
import { Check, Trash2, Star } from "lucide-react";

const SADDLE = "#84572F";
const TUSCAN = "#F1A805";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [saving, setSaving] = useState<string | null>(null);

  function load() {
    setLoading(true);
    reviewsApi.adminList().then(setReviews).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function approve(id: string) {
    setSaving(id);
    await reviewsApi.approve(id);
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, isApproved: true } : r));
    setSaving(null);
  }

  async function remove(id: string) {
    if (!confirm("Delete this review?")) return;
    setSaving(id);
    await reviewsApi.delete(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
    setSaving(null);
  }

  const shown = reviews.filter((r) => {
    if (filter === "pending") return !r.isApproved;
    if (filter === "approved") return r.isApproved;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap items-center">
        {(["all", "pending", "approved"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-full font-cinzel text-[11px] tracking-[0.25em] uppercase transition-all"
            style={{ background: filter === f ? TUSCAN : `${TUSCAN}10`, color: filter === f ? "#020608" : SADDLE }}>
            {f}
          </button>
        ))}
        <span className="ml-auto font-dm text-xs" style={{ color: `${SADDLE}60` }}>
          {reviews.filter((r) => !r.isApproved).length} pending approval
        </span>
      </div>

      {loading ? (
        <ReviewsSkeleton />
      ) : shown.length === 0 ? (
        <p className="text-center py-16 font-dm text-sm" style={{ color: `${SADDLE}60` }}>No reviews found.</p>
      ) : (
        <div className="space-y-3">
          {shown.map((r) => (
            <div key={r.id} className="rounded-2xl px-5 py-4 flex gap-4"
              style={{ background: "#fff", border: `1px solid ${r.isApproved ? `${TUSCAN}15` : "#FEF3C7"}`, boxShadow: `0 2px 8px ${TUSCAN}06` }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-dm text-sm font-semibold" style={{ color: SADDLE }}>{r.customerName}</p>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} fill={i < r.rating ? TUSCAN : "none"} style={{ color: TUSCAN }} />
                    ))}
                  </div>
                  {!r.isApproved && (
                    <span className="px-2 py-0.5 rounded-full font-cinzel text-[11px] tracking-[0.2em] uppercase"
                      style={{ background: "#FEF3C7", color: "#92400E" }}>Pending</span>
                  )}
                  {r.serviceSlug && (
                    <span className="font-cinzel text-[11px] tracking-[0.2em] uppercase"
                      style={{ color: `${SADDLE}50` }}>{r.serviceSlug}</span>
                  )}
                </div>
                <p className="font-dm text-sm" style={{ color: `${SADDLE}80` }}>{r.reviewText}</p>
                <p className="font-dm text-xs mt-1" style={{ color: `${SADDLE}40` }}>
                  {r.customerEmail ?? ""} · {new Date(r.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                {!r.isApproved && (
                  <button onClick={() => approve(r.id)} disabled={saving === r.id}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 hover:scale-105"
                    style={{ background: "#D1FAE5", color: "#059669" }}
                    title="Approve">
                    <Check size={16} />
                  </button>
                )}
                <button onClick={() => remove(r.id)} disabled={saving === r.id}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 hover:scale-105"
                  style={{ background: "#FEE2E2", color: "#DC2626" }}
                  title="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
