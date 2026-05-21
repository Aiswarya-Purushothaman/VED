"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  IndianRupee, ChevronDown, ChevronRight,
  Plus, X, Trash2, Check, Upload, ImageIcon,
} from "lucide-react";
import { servicesApi, uploadApi, type Service, type ServicePayload } from "@/lib/api";
import TagList from "./TagList";
import type { ServiceForm, PkgForm } from "./types";
import {
  SADDLE, TUSCAN, PLAN_COLORS, CATEGORIES, EMPTY_FORM, slugify,
} from "./constants";

const STEPS = ["Basic Info", "Included", "Packages", "Add-ons"];

interface Props {
  open: boolean;
  onClose: () => void;
  initial: Service | null;
  onSaved: () => void;
}

export default function ServiceDrawer({ open, onClose, initial, onSaved }: Props) {
  const [form, setForm] = useState<ServiceForm>(EMPTY_FORM);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setError("");
    if (initial) {
      setForm({
        name: initial.name,
        slug: initial.slug,
        emoji: initial.emoji ?? "",
        category: initial.category,
        shortDesc: initial.shortDesc,
        longDesc: initial.longDesc,
        image: initial.image,
        included: initial.included.length ? initial.included : [""],
        packages: (["basic", "premium", "luxury"] as const).map((pt) => {
          const p = initial.packages.find((pk) => pk.planType === pt);
          return {
            planType: pt,
            name: p?.name ?? (pt.charAt(0).toUpperCase() + pt.slice(1)),
            description: p?.description ?? "",
            items: p?.items.length ? p.items : [""],
            price: p?.price != null ? String(p.price) : "",
          };
        }),
        addons: initial.addons.length ? initial.addons.map((a) => a.name) : [""],
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [open, initial]);

  function set<K extends keyof ServiceForm>(k: K, v: ServiceForm[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function setPkg(i: number, k: keyof PkgForm, v: string | string[]) {
    setForm((f) => {
      const pkgs = [...f.packages];
      pkgs[i] = { ...pkgs[i], [k]: v };
      return { ...f, packages: pkgs };
    });
  }

  async function handleImageFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const { url } = await uploadApi.image(file);
      set("image", url);
    } catch (e: any) {
      setError(e.message ?? "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function validateStep(s: number): string {
    if (s === 0) {
      if (!form.name.trim()) return "Service name is required.";
      if (!form.shortDesc.trim()) return "Short description is required.";
      if (!form.longDesc.trim()) return "Long description is required.";
      if (!form.image.trim()) return "Please upload a service image.";
    }
    if (s === 1 && !form.included.some((v) => v.trim())) {
      return "Add at least one included item.";
    }
    if (s === 2) {
      for (const pkg of form.packages) {
        if (!pkg.description.trim()) return `${pkg.name}: description is required.`;
        if (!pkg.price.trim()) return `${pkg.name}: price is required.`;
        if (isNaN(parseFloat(pkg.price))) return `${pkg.name}: price must be a number.`;
        if (!pkg.items.some((v) => v.trim())) return `${pkg.name}: add at least one item.`;
      }
    }
    if (s === 3 && !form.addons.some((v) => v.trim())) {
      return "Add at least one add-on.";
    }
    return "";
  }

  function next() {
    const err = validateStep(step);
    if (err) { setError(err); return; }
    setError("");
    setStep((s) => s + 1);
  }

  function back() { setError(""); setStep((s) => s - 1); }

  async function save() {
    const err = validateStep(3);
    if (err) { setError(err); return; }
    setError("");
    setSaving(true);
    try {
      const payload: ServicePayload = {
        name: form.name.trim(),
        slug: form.slug.trim() || slugify(form.name),
        emoji: form.emoji.trim(),
        category: form.category,
        shortDesc: form.shortDesc.trim(),
        longDesc: form.longDesc.trim(),
        image: form.image.trim(),
        included: form.included.filter(Boolean),
        packages: form.packages.map((p) => ({
          planType: p.planType,
          name: p.name,
          description: p.description,
          items: p.items.filter(Boolean),
          price: parseFloat(p.price),
        })),
        addons: form.addons.filter(Boolean),
      };
      if (initial) {
        await servicesApi.update(initial.id, payload);
      } else {
        await servicesApi.create(payload);
      }
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e.message ?? "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />}

      <div
        className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-xl flex flex-col transition-transform duration-300 ease-out"
        style={{
          background: "#FFFBF5",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: `${TUSCAN}20` }}>
          <h2 className="font-playfair text-lg font-bold" style={{ color: SADDLE }}>
            {initial ? "Edit Service" : "Add Service"}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-amber-50"
            style={{ border: `1px solid ${TUSCAN}20`, color: SADDLE }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Step indicators */}
        <div className="px-6 py-4 border-b" style={{ borderColor: `${TUSCAN}15` }}>
          <div className="flex items-center gap-0">
            {STEPS.map((label, i) => {
              const done = i < step;
              const current = i === step;
              return (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                      style={{
                        background: done ? "#10B981" : current ? TUSCAN : `${SADDLE}15`,
                        color: done || current ? "#fff" : `${SADDLE}60`,
                        border: current ? `2px solid ${TUSCAN}` : "none",
                      }}
                    >
                      {done ? <Check size={12} /> : i + 1}
                    </div>
                    <span
                      className="font-cinzel text-[10px] tracking-[0.15em] uppercase whitespace-nowrap"
                      style={{ color: current ? SADDLE : `${SADDLE}50` }}
                    >
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 h-px mx-1 mb-4" style={{ background: i < step ? "#10B981" : `${SADDLE}15` }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="font-cinzel text-[11px] tracking-[0.25em] uppercase block mb-1.5" style={{ color: `${SADDLE}70` }}>
                  Service Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => { set("name", e.target.value); if (!initial) set("slug", slugify(e.target.value)); }}
                  placeholder="e.g. Birthday Decorations"
                  className="w-full border rounded-xl px-4 py-2.5 font-dm text-sm outline-none"
                  style={{ borderColor: `${TUSCAN}30`, color: SADDLE }}
                />
              </div>
              <div>
                <label className="font-cinzel text-[11px] tracking-[0.25em] uppercase block mb-1.5" style={{ color: `${SADDLE}70` }}>Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  placeholder="auto-generated"
                  className="w-full border rounded-xl px-4 py-2.5 font-dm text-sm outline-none"
                  style={{ borderColor: `${TUSCAN}30`, color: SADDLE }}
                />
              </div>
              <div>
                <label className="font-cinzel text-[11px] tracking-[0.25em] uppercase block mb-1.5" style={{ color: `${SADDLE}70` }}>Emoji</label>
                <input
                  value={form.emoji}
                  onChange={(e) => set("emoji", e.target.value)}
                  placeholder="🎂"
                  className="w-full border rounded-xl px-4 py-2.5 font-dm text-sm outline-none"
                  style={{ borderColor: `${TUSCAN}30`, color: SADDLE }}
                />
              </div>
              <div className="col-span-2">
                <label className="font-cinzel text-[11px] tracking-[0.25em] uppercase block mb-1.5" style={{ color: `${SADDLE}70` }}>Category</label>
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                    className="appearance-none w-full border rounded-xl px-4 py-2.5 font-dm text-sm outline-none cursor-pointer"
                    style={{ borderColor: `${TUSCAN}30`, color: SADDLE }}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: SADDLE }} />
                </div>
              </div>
              <div className="col-span-2">
                <label className="font-cinzel text-[11px] tracking-[0.25em] uppercase block mb-1.5" style={{ color: `${SADDLE}70` }}>Short Description *</label>
                <input
                  value={form.shortDesc}
                  onChange={(e) => set("shortDesc", e.target.value)}
                  placeholder="One-line description shown on cards"
                  className="w-full border rounded-xl px-4 py-2.5 font-dm text-sm outline-none"
                  style={{ borderColor: `${TUSCAN}30`, color: SADDLE }}
                />
              </div>
              <div className="col-span-2">
                <label className="font-cinzel text-[11px] tracking-[0.25em] uppercase block mb-1.5" style={{ color: `${SADDLE}70` }}>Long Description *</label>
                <textarea
                  value={form.longDesc}
                  onChange={(e) => set("longDesc", e.target.value)}
                  rows={4}
                  placeholder="Full service description…"
                  className="w-full border rounded-xl px-4 py-2.5 font-dm text-sm outline-none resize-none"
                  style={{ borderColor: `${TUSCAN}30`, color: SADDLE }}
                />
              </div>
              <div className="col-span-2">
                <label className="font-cinzel text-[11px] tracking-[0.25em] uppercase block mb-1.5" style={{ color: `${SADDLE}70` }}>Service Image *</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }}
                />
                {form.image ? (
                  <div
                    className="relative w-full h-40 rounded-xl overflow-hidden border group cursor-pointer"
                    style={{ borderColor: `${TUSCAN}30` }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Image src={form.image} alt="preview" fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Upload size={16} className="text-white" />
                      <span className="font-dm text-xs text-white">Change image</span>
                    </div>
                    {uploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors hover:bg-amber-50/50 disabled:opacity-60"
                    style={{ borderColor: `${TUSCAN}40` }}
                  >
                    {uploading ? (
                      <span className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: `${TUSCAN}30`, borderTopColor: TUSCAN }} />
                    ) : (
                      <>
                        <ImageIcon size={24} style={{ color: `${SADDLE}40` }} />
                        <span className="font-cinzel text-[11px] tracking-[0.2em] uppercase" style={{ color: `${SADDLE}60` }}>
                          Click to upload image
                        </span>
                        <span className="font-dm text-xs" style={{ color: `${SADDLE}40` }}>JPG, PNG, WEBP up to 5 MB</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 1: Included */}
          {step === 1 && (
            <div>
              <p className="font-dm text-xs mb-4" style={{ color: `${SADDLE}70` }}>
                List everything that is included in this service.
              </p>
              <TagList label="What's Included" items={form.included} onChange={(v) => set("included", v)} />
            </div>
          )}

          {/* Step 2: Packages */}
          {step === 2 && (
            <div className="space-y-5">
              <p className="font-dm text-xs" style={{ color: `${SADDLE}70` }}>
                All three plans are required. Fill in description, price, and items for each.
              </p>
              {form.packages.map((pkg, i) => (
                <div key={pkg.planType} className="rounded-2xl p-4 space-y-3"
                  style={{ background: "#fff", border: `1px solid ${PLAN_COLORS[pkg.planType]}30` }}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: PLAN_COLORS[pkg.planType] }} />
                    <p className="font-cinzel text-xs tracking-[0.3em] uppercase font-semibold"
                      style={{ color: PLAN_COLORS[pkg.planType] }}>{pkg.name} Plan</p>
                  </div>
                  <div>
                    <label className="font-cinzel text-[11px] tracking-[0.2em] uppercase block mb-1" style={{ color: `${SADDLE}60` }}>Description *</label>
                    <input
                      value={pkg.description}
                      onChange={(e) => setPkg(i, "description", e.target.value)}
                      placeholder="e.g. Simple and sweet birthday setup"
                      className="w-full border rounded-lg px-3 py-2 font-dm text-sm outline-none"
                      style={{ borderColor: `${TUSCAN}25`, color: SADDLE }}
                    />
                  </div>
                  <div>
                    <label className="font-cinzel text-[11px] tracking-[0.2em] uppercase block mb-1" style={{ color: `${SADDLE}60` }}>Price *</label>
                    <div className="flex items-center gap-1 border rounded-lg px-3 py-2" style={{ borderColor: `${TUSCAN}25` }}>
                      <IndianRupee size={12} style={{ color: `${SADDLE}50` }} />
                      <input
                        type="number"
                        value={pkg.price}
                        onChange={(e) => setPkg(i, "price", e.target.value)}
                        placeholder="0"
                        className="w-full font-dm text-sm outline-none bg-transparent"
                        style={{ color: SADDLE }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-cinzel text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: `${SADDLE}60` }}>Items included *</p>
                    <div className="space-y-2">
                      {pkg.items.map((item, j) => (
                        <div key={j} className="flex gap-2">
                          <input
                            value={item}
                            onChange={(e) => {
                              const next = [...pkg.items]; next[j] = e.target.value;
                              setPkg(i, "items", next);
                            }}
                            placeholder="Item name…"
                            className="flex-1 border rounded-lg px-3 py-1.5 font-dm text-xs outline-none"
                            style={{ borderColor: `${TUSCAN}25`, color: SADDLE }}
                          />
                          <button
                            disabled={pkg.items.length === 1}
                            onClick={() => setPkg(i, "items", pkg.items.filter((_, idx) => idx !== j))}
                            className="w-7 h-7 flex items-center justify-center rounded-lg disabled:opacity-30"
                            style={{ background: "#FEE2E2" }}
                          >
                            <Trash2 size={11} style={{ color: "#DC2626" }} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setPkg(i, "items", [...pkg.items, ""])}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-dm text-xs"
                        style={{ border: `1px dashed ${TUSCAN}40`, color: `${SADDLE}80` }}
                      >
                        <Plus size={11} /> Add item
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Add-ons */}
          {step === 3 && (
            <div>
              <p className="font-dm text-xs mb-4" style={{ color: `${SADDLE}70` }}>
                Add optional extras customers can request alongside this service.
              </p>
              <TagList label="Add-ons" items={form.addons} onChange={(v) => set("addons", v)} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t space-y-3" style={{ borderColor: `${TUSCAN}15` }}>
          {error && <p className="font-dm text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <div className="flex gap-3">
            {step > 0 ? (
              <button onClick={back} className="flex-1 py-3 rounded-xl font-cinzel text-xs tracking-[0.3em] uppercase"
                style={{ border: `1px solid ${TUSCAN}30`, color: SADDLE }}>Back</button>
            ) : (
              <button onClick={onClose} className="flex-1 py-3 rounded-xl font-cinzel text-xs tracking-[0.3em] uppercase"
                style={{ border: `1px solid ${TUSCAN}30`, color: SADDLE }}>Cancel</button>
            )}
            {step < STEPS.length - 1 ? (
              <button onClick={next}
                className="flex-1 py-3 rounded-xl font-cinzel text-xs tracking-[0.3em] uppercase flex items-center justify-center gap-2"
                style={{ background: TUSCAN, color: "#020608" }}>
                Next <ChevronRight size={14} />
              </button>
            ) : (
              <button onClick={save} disabled={saving}
                className="flex-1 py-3 rounded-xl font-cinzel text-xs tracking-[0.3em] uppercase disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: TUSCAN, color: "#020608" }}>
                {saving
                  ? <span className="w-4 h-4 border-2 border-[#020608]/30 border-t-[#020608] rounded-full animate-spin" />
                  : <Check size={14} />}
                {saving ? "Saving…" : initial ? "Save Changes" : "Create Service"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
