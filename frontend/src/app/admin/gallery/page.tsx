"use client";
import { useEffect, useRef, useState } from "react";
import { galleryApi, uploadApi, type GalleryImage } from "@/lib/api";
import { compressImage } from "@/lib/compressImage";
import { GallerySkeleton } from "../_components/Skeletons";
import { Plus, Trash2, Eye, EyeOff, Upload, ImageIcon } from "lucide-react";
import Image from "next/image";

const SADDLE = "#84572F";
const TUSCAN = "#F1A805";

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newImg, setNewImg] = useState({ src: "", category: "", alt: "" });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function load() {
    setLoading(true);
    galleryApi.adminList().then(setImages).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleGalleryFile(file: File) {
    setUploading(true);
    setUploadError("");
    try {
      const compressed = await compressImage(file);
      const { url } = await uploadApi.image(compressed);
      setNewImg((p) => ({ ...p, src: url }));
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function addImage() {
    if (!newImg.src.trim()) return;
    setSaving("new");
    const created = await galleryApi.create(newImg);
    setImages((prev) => [...prev, created]);
    setNewImg({ src: "", category: "", alt: "" });
    setUploadError("");
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
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleGalleryFile(f); }}
          />
          {newImg.src ? (
            <div
              className="relative w-full h-40 rounded-xl overflow-hidden border group cursor-pointer"
              style={{ borderColor: `${TUSCAN}30` }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Image src={newImg.src} alt="preview" fill className="object-cover" unoptimized />
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
                  <span className="font-dm text-xs" style={{ color: `${SADDLE}40` }}>Any size — auto compressed to 2 MB</span>
                </>
              )}
            </button>
          )}
          {uploadError && <p className="font-dm text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{uploadError}</p>}
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
