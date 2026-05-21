"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { servicesApi, type Service, type ServicePackage } from "@/lib/api";
import { IndianRupee, ToggleLeft, ToggleRight, ChevronDown, Plus, Pencil, Trash2 } from "lucide-react";
import ServiceDrawer from "./_components/ServiceDrawer";
import { SADDLE, TUSCAN, PLAN_COLORS } from "./_components/constants";
import { ServicesSkeleton } from "../_components/Skeletons";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Service | null>(null);

  const load = useCallback((silent = false) => {
    if (!silent) setLoading(true);
    servicesApi.adminList().then(setServices).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggleActive(svc: Service) {
    setSaving(svc.id);
    await servicesApi.update(svc.id, { isActive: !svc.isActive });
    setServices((prev) => prev.map((s) => s.id === svc.id ? { ...s, isActive: !svc.isActive } : s));
    setSaving(null);
  }

  async function savePrice(pkg: ServicePackage) {
    const val = parseFloat(priceInputs[pkg.id] ?? "");
    if (isNaN(val)) return;
    setSaving(pkg.id);
    await servicesApi.updatePackagePrice(pkg.id, val);
    setServices((prev) => prev.map((s) => ({
      ...s,
      packages: s.packages.map((p) => p.id === pkg.id ? { ...p, price: val } : p),
    })));
    setPriceInputs((p) => { const n = { ...p }; delete n[pkg.id]; return n; });
    setSaving(null);
  }

  async function deleteService(svc: Service) {
    if (!confirm(`Delete "${svc.name}"? This cannot be undone.`)) return;
    setSaving(svc.id);
    await servicesApi.delete(svc.id);
    setServices((prev) => prev.filter((s) => s.id !== svc.id));
    setSaving(null);
  }

  const categories = Array.from(new Set(services.map((s) => s.category))).sort();
  const shown = services.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = !catFilter || s.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <>
      <div className="space-y-5">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services…"
            className="border rounded-xl px-4 py-2.5 font-dm text-sm outline-none flex-1 min-w-48"
            style={{ borderColor: `${TUSCAN}30`, color: SADDLE }}
          />
          <div className="relative">
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2.5 rounded-xl border font-dm text-sm outline-none cursor-pointer"
              style={{ borderColor: `${TUSCAN}30`, color: SADDLE }}
            >
              <option value="">All categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: SADDLE }} />
          </div>
          <span className="font-dm text-xs" style={{ color: `${SADDLE}60` }}>{shown.length} services</span>
          <button
            onClick={() => { setEditTarget(null); setDrawerOpen(true); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-cinzel text-[11px] tracking-[0.25em] uppercase hover:scale-[1.02] transition-all"
            style={{ background: TUSCAN, color: "#020608" }}
          >
            <Plus size={14} /> Add Service
          </button>
        </div>

        {loading ? (
          <ServicesSkeleton />
        ) : shown.length === 0 ? (
          <p className="text-center py-16 font-dm text-sm" style={{ color: `${SADDLE}60` }}>No services found.</p>
        ) : (
          <div className="space-y-3">
            {shown.map((svc) => (
              <ServiceRow
                key={svc.id}
                svc={svc}
                expanded={expanded === svc.id}
                onToggleExpand={() => setExpanded(expanded === svc.id ? null : svc.id)}
                saving={saving}
                priceInputs={priceInputs}
                onPriceChange={(id, val) => setPriceInputs((p) => ({ ...p, [id]: val }))}
                onSavePrice={savePrice}
                onToggleActive={toggleActive}
                onEdit={(s) => { setEditTarget(s); setDrawerOpen(true); }}
                onDelete={deleteService}
              />
            ))}
          </div>
        )}
      </div>

      <ServiceDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initial={editTarget}
        onSaved={() => load(true)}
      />
    </>
  );
}

/* ── Service row ─────────────────────────────────────── */
function ServiceRow({
  svc, expanded, saving, priceInputs,
  onPriceChange, onSavePrice, onToggleActive, onEdit, onDelete,
}: {
  svc: Service;
  expanded: boolean;
  onToggleExpand: () => void;
  saving: string | null;
  priceInputs: Record<string, string>;
  onPriceChange: (id: string, val: string) => void;
  onSavePrice: (pkg: ServicePackage) => void;
  onToggleActive: (svc: Service) => void;
  onEdit: (svc: Service) => void;
  onDelete: (svc: Service) => void;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "#fff",
        border: `1px solid ${svc.isActive ? `${TUSCAN}15` : "#E5E7EB"}`,
        opacity: svc.isActive ? 1 : 0.7,
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3.5">
        <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border" style={{ borderColor: `${TUSCAN}15` }}>
          <Image src={svc.image} alt={svc.name} fill className="object-cover" unoptimized />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-dm text-sm font-semibold" style={{ color: SADDLE }}>{svc.name}</p>
            <span className="px-2 py-0.5 rounded-full font-cinzel text-[11px] tracking-[0.2em] uppercase"
              style={{ background: `${TUSCAN}12`, color: SADDLE }}>{svc.category}</span>
            {!svc.isActive && (
              <span className="px-2 py-0.5 rounded-full font-cinzel text-[11px] tracking-[0.2em] uppercase"
                style={{ background: "#FEE2E2", color: "#DC2626" }}>Inactive</span>
            )}
          </div>
          <div className="flex gap-3 mt-0.5 flex-wrap">
            {svc.packages.map((pkg) => (
              <span key={pkg.id} className="font-dm text-xs" style={{ color: `${SADDLE}55` }}>
                {pkg.name}: {pkg.price ? `₹${Number(pkg.price).toLocaleString("en-IN")}` : "—"}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button onClick={() => onEdit(svc)}
            className="p-2 rounded-lg hover:bg-amber-50 transition-colors"
            style={{ border: `1px solid ${TUSCAN}20`, color: SADDLE }}
            title="Edit service">
            <Pencil size={13} />
          </button>
          <button onClick={() => onDelete(svc)} disabled={saving === svc.id}
            className="p-2 rounded-lg transition-colors disabled:opacity-50"
            style={{ border: "1px solid #FECACA" }}
            title="Delete service">
            <Trash2 size={13} style={{ color: "#DC2626" }} />
          </button>
          <button onClick={() => onToggleActive(svc)} disabled={saving === svc.id}
            className="transition-all disabled:opacity-50"
            title={svc.isActive ? "Deactivate" : "Activate"}>
            {svc.isActive
              ? <ToggleRight size={26} style={{ color: "#10B981" }} />
              : <ToggleLeft size={26} style={{ color: "#9CA3AF" }} />}
          </button>
        </div>
      </div>

      {/* Expanded: package price editor */}
      {expanded && (
        <div className="border-t px-5 py-4 space-y-4" style={{ borderColor: `${TUSCAN}10`, background: "#FFFBF5" }}>
          <p className="font-cinzel text-[11px] tracking-[0.3em] uppercase" style={{ color: `${SADDLE}70` }}>Set Package Prices</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {svc.packages.map((pkg) => (
              <div key={pkg.id} className="rounded-xl p-4"
                style={{ background: "#fff", border: `1px solid ${PLAN_COLORS[pkg.planType] ?? TUSCAN}25` }}>
                <p className="font-cinzel text-[11px] tracking-[0.25em] uppercase mb-1"
                  style={{ color: PLAN_COLORS[pkg.planType] ?? TUSCAN }}>{pkg.name}</p>
                <p className="font-dm text-xs mb-3" style={{ color: `${SADDLE}60` }}>{pkg.description}</p>
                <ul className="space-y-1 mb-3">
                  {pkg.items.map((item) => (
                    <li key={item} className="font-dm text-xs flex items-start gap-1" style={{ color: `${SADDLE}80` }}>
                      <span className="mt-1 flex-shrink-0" style={{ color: TUSCAN }}>·</span> {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 border rounded-lg px-2 py-1.5 flex-1" style={{ borderColor: `${TUSCAN}30` }}>
                    <IndianRupee size={11} style={{ color: `${SADDLE}60` }} />
                    <input
                      type="number"
                      placeholder={pkg.price != null ? String(pkg.price) : "Price"}
                      value={priceInputs[pkg.id] ?? ""}
                      onChange={(e) => onPriceChange(pkg.id, e.target.value)}
                      className="w-full font-dm text-xs outline-none bg-transparent"
                      style={{ color: SADDLE }}
                    />
                  </div>
                  <button
                    onClick={() => onSavePrice(pkg)}
                    disabled={saving === pkg.id}
                    className="px-3 py-1.5 rounded-lg font-cinzel text-[11px] tracking-[0.2em] uppercase disabled:opacity-50"
                    style={{ background: TUSCAN, color: "#020608" }}
                  >
                    {saving === pkg.id ? "…" : "Set"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {svc.addons.length > 0 && (
            <div>
              <p className="font-cinzel text-[11px] tracking-[0.25em] uppercase mb-2" style={{ color: `${SADDLE}60` }}>Add-ons</p>
              <div className="flex flex-wrap gap-2">
                {svc.addons.map((a) => (
                  <span key={a.id} className="px-3 py-1 rounded-full font-dm text-xs"
                    style={{ background: `${TUSCAN}10`, color: SADDLE }}>{a.name}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
