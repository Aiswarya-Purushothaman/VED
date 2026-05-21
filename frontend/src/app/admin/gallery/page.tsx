"use client";
import { useEffect, useState } from "react";
import { galleryApi, type GalleryImage } from "@/lib/api";
import { GallerySkeleton } from "../_components/Skeletons";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

const SADDLE = "#84572F";
const TUSCAN = "#F1A805";

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newImg, setNewImg] = useState({ src: "", category: "", alt: "" });

  function load() {
    setLoading(true);
    galleryApi.adminList().then(setImages).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function addImage() {
    if (!newImg.src.trim()) return;
    setSaving("new");
    const created = await galleryApi.create(newImg);
    setImages((prev) => [...prev, created]);
    setNewImg({ src: "", category: "", alt: "" });
    setShowAdd(false);
    setSaving(null);
  }

  async function toggle(img: GalleryImage) {
    setSaving(img.id);
    await galleryApi.update(img.id, { isActive: !img.isActive });
    setImages((prev) => prev.map((i) => i.id === img.id ? { ...i, isActive: !img.isActive } : i));
    setSaving(null);
  }

  async function remove(id: string) {
    if (!confirm("Delete this image?")) return;
    setSaving(id);
    await galleryApi.delete(id);
    setImages((prev) => prev.filter((i) => i.id !== id));
    setSaving(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="font-dm text-sm" style={{ color: `${SADDLE}70` }}>{images.length} images total</p>
        <button onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-cinzel text-[11px] tracking-[0.25em] uppercase transition-all hover:scale-[1.02]"
          style={{ background: TUSCAN, color: "#020608" }}>
          <Plus size={14} />
          Add Image
        </button>
      </div>

      {/* Add image form */}
      {showAdd && (
        <div className="rounded-2xl p-5 space-y-3"
          style={{ background: "#fff", border: `1px solid ${TUSCAN}25` }}>
          <p className="font-cinzel text-[11px] tracking-[0.3em] uppercase" style={{ color: SADDLE }}>New Gallery Image</p>
          <input value={newImg.src} onChange={(e) => setNewImg((p) => ({ ...p, src: e.target.value }))}
            placeholder="Image URL *"
            className="w-full border rounded-xl px-4 py-2.5 font-dm text-sm outline-none"
            style={{ borderColor: `${TUSCAN}30`, color: SADDLE }} />
          <div className="flex gap-3">
            <input value={newImg.category} onChange={(e) => setNewImg((p) => ({ ...p, category: e.target.value }))}
              placeholder="Category (e.g. wedding)"
              className="flex-1 border rounded-xl px-4 py-2.5 font-dm text-sm outline-none"
              style={{ borderColor: `${TUSCAN}30`, color: SADDLE }} />
            <input value={newImg.alt} onChange={(e) => setNewImg((p) => ({ ...p, alt: e.target.value }))}
              placeholder="Alt text"
              className="flex-1 border rounded-xl px-4 py-2.5 font-dm text-sm outline-none"
              style={{ borderColor: `${TUSCAN}30`, color: SADDLE }} />
          </div>
          {newImg.src && (
            <div className="relative w-32 h-24 rounded-xl overflow-hidden border" style={{ borderColor: `${TUSCAN}20` }}>
              <Image src={newImg.src} alt="preview" fill className="object-cover" unoptimized />
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={addImage} disabled={saving === "new" || !newImg.src}
              className="px-5 py-2 rounded-xl font-cinzel text-[11px] tracking-[0.25em] uppercase disabled:opacity-50"
              style={{ background: TUSCAN, color: "#020608" }}>
              {saving === "new" ? "Adding…" : "Add"}
            </button>
            <button onClick={() => setShowAdd(false)}
              className="px-5 py-2 rounded-xl font-cinzel text-[11px] tracking-[0.25em] uppercase"
              style={{ border: `1px solid ${TUSCAN}30`, color: SADDLE }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <GallerySkeleton />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((img) => (
            <div key={img.id} className="rounded-2xl overflow-hidden group relative"
              style={{ border: `1px solid ${TUSCAN}15`, opacity: img.isActive ? 1 : 0.5 }}>
              <div className="relative w-full h-36">
                <Image src={img.src} alt={img.alt ?? ""} fill className="object-cover" unoptimized />
              </div>
              <div className="px-3 py-2" style={{ background: "#fff" }}>
                <p className="font-dm text-xs truncate" style={{ color: SADDLE }}>{img.alt ?? "—"}</p>
                {img.category && (
                  <p className="font-cinzel text-[11px] tracking-[0.2em] uppercase mt-0.5" style={{ color: `${SADDLE}50` }}>{img.category}</p>
                )}
              </div>
              {/* Action overlay */}
              <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => toggle(img)} disabled={saving === img.id}
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "#fff", border: `1px solid ${TUSCAN}30` }}>
                  {img.isActive ? <EyeOff size={12} style={{ color: SADDLE }} /> : <Eye size={12} style={{ color: "#10B981" }} />}
                </button>
                <button onClick={() => remove(img.id)} disabled={saving === img.id}
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "#FEE2E2", border: "1px solid #FECACA" }}>
                  <Trash2 size={12} style={{ color: "#DC2626" }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
