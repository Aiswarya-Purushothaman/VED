"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { galleryApi, servicesApi, uploadApi, type GalleryImage, type ServiceSummary } from "@/lib/api";
import { compressImage } from "@/lib/compressImage";
import { GallerySkeleton } from "../_components/Skeletons";
import {
  Plus, Trash2, Eye, EyeOff, Upload, ImageIcon, X,
  CheckCircle2, AlertCircle, Loader2, ChevronDown, Search, Crop as CropIcon, Pencil,
} from "lucide-react";
import Image from "next/image";

const SADDLE = "#84572F";
const TUSCAN = "#F1A805";

type Status = "needs-crop" | "uploading" | "done" | "error";

type PendingImg = {
  file: File;
  previewUrl: string;
  src: string;
  alt: string;
  status: Status;
  error?: string;
};

// ─── Crop modal ────────────────────────────────────────────────────────────────

const RATIOS: { label: string; value: number | undefined }[] = [
  { label: "Free", value: undefined },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:4", value: 3 / 4 },
];

function CropModal({
  src,
  index,
  total,
  onConfirm,
  onSkip,
}: {
  src: string;
  index: number;
  total: number;
  onConfirm: (blob: Blob) => void;
  onSkip: () => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>({ unit: "%", width: 90, height: 90, x: 5, y: 5 });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);

  function applyCrop() {
    const img = imgRef.current;
    if (!img || !completedCrop || completedCrop.width === 0 || completedCrop.height === 0) {
      onSkip();
      return;
    }
    const canvas = document.createElement("canvas");
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(
      img,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0, 0,
      canvas.width,
      canvas.height,
    );
    canvas.toBlob((blob) => { if (blob) onConfirm(blob); }, "image/jpeg", 0.95);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(2,6,8,0.75)" }}>
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col" style={{ background: "#fff", maxHeight: "90vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: `1px solid ${TUSCAN}20` }}>
          <div className="flex items-center gap-2.5">
            <CropIcon size={15} style={{ color: SADDLE }} />
            <span className="font-cinzel text-[11px] tracking-[0.3em] uppercase" style={{ color: SADDLE }}>
              Crop Image
            </span>
            {total > 1 && (
              <span className="font-dm text-xs px-2 py-0.5 rounded-full" style={{ background: `${TUSCAN}20`, color: SADDLE }}>
                {index + 1} / {total}
              </span>
            )}
          </div>
          <button onClick={onSkip} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100">
            <X size={14} style={{ color: `${SADDLE}70` }} />
          </button>
        </div>

        {/* Aspect ratio presets */}
        <div className="flex items-center gap-1.5 px-5 py-2.5" style={{ borderBottom: `1px solid ${TUSCAN}10` }}>
          <span className="font-dm text-xs mr-1" style={{ color: `${SADDLE}60` }}>Ratio:</span>
          {RATIOS.map((r) => (
            <button
              key={r.label}
              onClick={() => setAspect(r.value)}
              className="px-2.5 py-1 rounded-lg font-dm text-xs transition-colors"
              style={{
                background: aspect === r.value ? TUSCAN : `${TUSCAN}15`,
                color: aspect === r.value ? "#020608" : SADDLE,
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Crop area */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-4" style={{ background: "#F8F5F0", minHeight: 0 }}>
          <ReactCrop
            crop={crop}
            onChange={setCrop}
            onComplete={setCompletedCrop}
            aspect={aspect}
            style={{ maxHeight: "55vh" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={src}
              alt="crop preview"
              style={{ maxHeight: "55vh", maxWidth: "100%", display: "block" }}
            />
          </ReactCrop>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5" style={{ borderTop: `1px solid ${TUSCAN}20` }}>
          <p className="font-dm text-xs" style={{ color: `${SADDLE}50` }}>
            Drag to set crop region
          </p>
          <div className="flex gap-2">
            <button
              onClick={onSkip}
              className="px-4 py-2 rounded-xl font-cinzel text-[10px] tracking-[0.25em] uppercase"
              style={{ border: `1px solid ${TUSCAN}30`, color: SADDLE }}
            >
              Skip
            </button>
            <button
              onClick={applyCrop}
              className="px-4 py-2 rounded-xl font-cinzel text-[10px] tracking-[0.25em] uppercase"
              style={{ background: TUSCAN, color: "#020608" }}
            >
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [services, setServices] = useState<ServiceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editingAlt, setEditingAlt] = useState<{ id: string; value: string } | null>(null);
  const [altSaving, setAltSaving] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const categoryRef = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState<PendingImg[]>([]);
  const [cropQueue, setCropQueue] = useState<string[]>([]); // previewUrls queued to crop
  const [cropTarget, setCropTarget] = useState<string | null>(null); // currently cropping
  const [addingAll, setAddingAll] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const categoryRef2 = useRef(category);
  categoryRef2.current = category;

  function load() {
    setLoading(true);
    galleryApi.adminList().then(setImages).finally(() => setLoading(false));
  }

  useEffect(() => { load(); servicesApi.list().then(setServices); }, []);

  // Click-outside for category dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
        setCategorySearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Paste support
  useEffect(() => {
    if (!showAdd) return;
    function handlePaste(e: ClipboardEvent) {
      if (!categoryRef2.current) return;
      const files = Array.from(e.clipboardData?.items ?? [])
        .filter((item) => item.kind === "file" && item.type.startsWith("image/"))
        .map((item) => item.getAsFile())
        .filter(Boolean) as File[];
      if (files.length) enqueueFiles(files);
    }
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAdd]);

  // Advance crop queue
  useEffect(() => {
    if (cropTarget !== null) return;
    if (cropQueue.length === 0) return;
    setCropTarget(cropQueue[0]);
    setCropQueue((q) => q.slice(1));
  }, [cropQueue, cropTarget]);

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  function resetForm() {
    setPending((prev) => { prev.forEach((p) => URL.revokeObjectURL(p.previewUrl)); return []; });
    setCropQueue([]);
    setCropTarget(null);
    setCategory("");
    setShowAdd(false);
  }

  // Add files → straight to crop queue (no upload yet)
  function enqueueFiles(files: File[]) {
    const newEntries: PendingImg[] = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      src: "",
      alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      status: "needs-crop",
    }));
    setPending((prev) => [...prev, ...newEntries]);
    setCropQueue((prev) => [...prev, ...newEntries.map((e) => e.previewUrl)]);
  }

  // Upload a single entry (after crop decision)
  const uploadEntry = useCallback(async (previewUrl: string, file: File) => {
    setPending((prev) => prev.map((p) => p.previewUrl === previewUrl ? { ...p, status: "uploading" } : p));
    try {
      const compressed = await compressImage(file);
      const { url } = await uploadApi.image(compressed, categoryRef2.current.trim() || undefined);
      setPending((prev) => prev.map((p) => p.previewUrl === previewUrl ? { ...p, src: url, status: "done" } : p));
    } catch (e: unknown) {
      setPending((prev) => prev.map((p) =>
        p.previewUrl === previewUrl
          ? { ...p, status: "error", error: e instanceof Error ? e.message : "Upload failed" }
          : p
      ));
    }
  }, []);

  // Crop confirmed — swap preview with cropped blob and upload
  function handleCropConfirm(blob: Blob) {
    if (!cropTarget) return;
    const entry = pending.find((p) => p.previewUrl === cropTarget);
    if (!entry) { setCropTarget(null); return; }

    const croppedFile = new File([blob], entry.file.name, { type: "image/jpeg" });
    const newPreviewUrl = URL.createObjectURL(blob);

    URL.revokeObjectURL(entry.previewUrl);
    setPending((prev) =>
      prev.map((p) =>
        p.previewUrl === cropTarget
          ? { ...p, file: croppedFile, previewUrl: newPreviewUrl }
          : p
      )
    );

    setCropTarget(null);
    uploadEntry(newPreviewUrl, croppedFile);
  }

  // Skip crop — upload original file
  function handleCropSkip() {
    if (!cropTarget) return;
    const entry = pending.find((p) => p.previewUrl === cropTarget);
    setCropTarget(null);
    if (entry) uploadEntry(entry.previewUrl, entry.file);
  }

  // Re-open crop for a specific pending image (cancels current if needed)
  function recrop(previewUrl: string) {
    setPending((prev) =>
      prev.map((p) => p.previewUrl === previewUrl ? { ...p, status: "needs-crop", src: "", error: undefined } : p)
    );
    setCropTarget(previewUrl);
  }

  function removePending(previewUrl: string) {
    if (cropTarget === previewUrl) setCropTarget(null);
    setCropQueue((q) => q.filter((u) => u !== previewUrl));
    setPending((prev) => {
      URL.revokeObjectURL(previewUrl);
      return prev.filter((p) => p.previewUrl !== previewUrl);
    });
  }

  async function addAll() {
    const ready = pending.filter((p) => p.status === "done");
    if (!ready.length) return;
    setAddingAll(true);
    await Promise.all(ready.map((p) => galleryApi.create({ src: p.src, category, alt: p.alt })));
    load();
    resetForm();
    setAddingAll(false);
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

  async function saveAlt(id: string, alt: string) {
    setAltSaving(id);
    await galleryApi.update(id, { alt });
    setImages((prev) => prev.map((i) => i.id === id ? { ...i, alt } : i));
    setEditingAlt(null);
    setAltSaving(null);
  }

  const cropTargetEntry = cropTarget ? pending.find((p) => p.previewUrl === cropTarget) : null;
  const cropQueueTotal = (cropTarget ? 1 : 0) + cropQueue.length;
  const currentCropIndex = cropTarget
    ? pending.findIndex((p) => p.previewUrl === cropTarget)
    : -1;

  const doneCount = pending.filter((p) => p.status === "done").length;
  const uploadingCount = pending.filter((p) => p.status === "uploading").length;

  return (
    <div className="space-y-6">
      {/* Crop modal */}
      {cropTargetEntry && (
        <CropModal
          src={cropTargetEntry.previewUrl}
          index={currentCropIndex}
          total={cropQueueTotal + pending.filter((p) => p.status === "needs-crop" && p.previewUrl !== cropTarget).length}
          onConfirm={handleCropConfirm}
          onSkip={handleCropSkip}
        />
      )}

      <div className="flex items-center justify-between">
        <p className="font-dm text-sm" style={{ color: `${SADDLE}70` }}>{images.length} images total</p>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-cinzel text-[11px] tracking-[0.25em] uppercase transition-all hover:scale-[1.02]"
          style={{ background: TUSCAN, color: "#020608" }}
        >
          <Plus size={14} />
          Add Images
        </button>
      </div>

      {/* Add images form */}
      {showAdd && (
        <div className="rounded-2xl p-5 space-y-4" style={{ background: "#fff", border: `1px solid ${TUSCAN}25` }}>
          <p className="font-cinzel text-[11px] tracking-[0.3em] uppercase" style={{ color: SADDLE }}>
            New Gallery Images
          </p>

          {/* Searchable category dropdown */}
          <div ref={categoryRef} className="relative">
            <button
              type="button"
              onClick={() => { setCategoryOpen((o) => !o); setCategorySearch(""); }}
              className="w-full border rounded-xl px-4 py-2.5 font-dm text-sm outline-none bg-white flex items-center justify-between text-left"
              style={{ borderColor: categoryOpen ? TUSCAN : `${TUSCAN}30`, color: category ? SADDLE : `${SADDLE}60` }}
            >
              <span>{category || "Select service category"}</span>
              <ChevronDown size={14} className={`flex-shrink-0 transition-transform ${categoryOpen ? "rotate-180" : ""}`} style={{ color: `${SADDLE}60` }} />
            </button>

            {categoryOpen && (
              <div className="absolute z-20 mt-1 w-full rounded-xl overflow-hidden shadow-lg" style={{ border: `1px solid ${TUSCAN}30`, background: "#fff" }}>
                <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: `1px solid ${TUSCAN}20` }}>
                  <Search size={13} style={{ color: `${SADDLE}50` }} />
                  <input
                    autoFocus
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    placeholder="Search services…"
                    className="flex-1 font-dm text-sm outline-none bg-transparent"
                    style={{ color: SADDLE }}
                  />
                  {categorySearch && (
                    <button onClick={() => setCategorySearch("")}>
                      <X size={12} style={{ color: `${SADDLE}50` }} />
                    </button>
                  )}
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredServices.length === 0 ? (
                    <p className="px-4 py-3 font-dm text-xs" style={{ color: `${SADDLE}50` }}>No services found</p>
                  ) : (
                    filteredServices.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => { setCategory(s.name); setCategoryOpen(false); setCategorySearch(""); }}
                        className="w-full text-left px-4 py-2.5 font-dm text-sm transition-colors hover:bg-amber-50"
                        style={{ color: s.name === category ? TUSCAN : SADDLE, background: s.name === category ? "#FFF8E7" : undefined }}
                      >
                        {s.name}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Drop zone */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => { if (e.target.files?.length) { enqueueFiles(Array.from(e.target.files)); e.target.value = ""; } }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={!category}
            onDragOver={(e) => { e.preventDefault(); if (category) setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              if (!category) return;
              const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
              if (files.length) enqueueFiles(files);
            }}
            className="w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              borderColor: dragging ? TUSCAN : `${TUSCAN}40`,
              background: dragging ? "#FFF8E7" : undefined,
            }}
          >
            <ImageIcon size={24} style={{ color: dragging ? TUSCAN : `${SADDLE}40` }} />
            <span className="font-cinzel text-[11px] tracking-[0.2em] uppercase" style={{ color: dragging ? TUSCAN : `${SADDLE}60` }}>
              {dragging ? "Drop to upload" : category ? "Click, drag & drop, or paste images" : "Select a service first"}
            </span>
            {!dragging && (
              <span className="font-dm text-xs" style={{ color: `${SADDLE}40` }}>
                Each image opens in crop editor before uploading
              </span>
            )}
          </button>

          {/* Pending image list */}
          {pending.length > 0 && (
            <div className="space-y-2">
              <p className="font-cinzel text-[10px] tracking-[0.25em] uppercase" style={{ color: `${SADDLE}60` }}>
                {doneCount}/{pending.length} ready
                {uploadingCount > 0 && ` · ${uploadingCount} uploading…`}
                {cropQueueTotal > 0 && ` · ${cropQueueTotal} waiting to crop`}
              </p>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {pending.map((p) => (
                  <div
                    key={p.previewUrl}
                    className="flex items-center gap-3 rounded-xl p-2"
                    style={{ background: "#FAFAFA", border: `1px solid ${TUSCAN}15` }}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={p.previewUrl} alt="" fill className="object-cover" unoptimized />
                      {(p.status === "uploading" || p.status === "needs-crop") && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          {p.status === "uploading"
                            ? <Loader2 size={16} className="text-white animate-spin" />
                            : <CropIcon size={14} className="text-white" />}
                        </div>
                      )}
                    </div>

                    {/* Alt text */}
                    <input
                      value={p.alt}
                      onChange={(e) =>
                        setPending((prev) =>
                          prev.map((img) => img.previewUrl === p.previewUrl ? { ...img, alt: e.target.value } : img)
                        )
                      }
                      placeholder="Alt text"
                      className="flex-1 border rounded-lg px-3 py-1.5 font-dm text-xs outline-none min-w-0"
                      style={{ borderColor: `${TUSCAN}25`, color: SADDLE }}
                    />

                    {/* Status + re-crop */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {p.status === "needs-crop" && <span className="font-dm text-[10px]" style={{ color: `${SADDLE}50` }}>In queue</span>}
                      {p.status === "uploading" && <Loader2 size={15} className="animate-spin" style={{ color: TUSCAN }} />}
                      {p.status === "done" && (
                        <>
                          <CheckCircle2 size={15} style={{ color: "#10B981" }} />
                          <button
                            title="Re-crop"
                            onClick={() => recrop(p.previewUrl)}
                            className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-amber-50"
                          >
                            <CropIcon size={11} style={{ color: `${SADDLE}60` }} />
                          </button>
                        </>
                      )}
                      {p.status === "error" && (
                        <span title={p.error}>
                          <AlertCircle size={15} style={{ color: "#DC2626" }} />
                        </span>
                      )}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removePending(p.previewUrl)}
                      className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center hover:bg-red-50"
                    >
                      <X size={12} style={{ color: `${SADDLE}60` }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={addAll}
              disabled={addingAll || doneCount === 0}
              className="px-5 py-2 rounded-xl font-cinzel text-[11px] tracking-[0.25em] uppercase disabled:opacity-50 inline-flex items-center gap-2"
              style={{ background: TUSCAN, color: "#020608" }}
            >
              {addingAll ? (
                <><Loader2 size={12} className="animate-spin" /> Adding…</>
              ) : (
                <><Upload size={12} /> Add {doneCount > 0 ? `${doneCount} Image${doneCount > 1 ? "s" : ""}` : "Images"}</>
              )}
            </button>
            <button
              onClick={resetForm}
              className="px-5 py-2 rounded-xl font-cinzel text-[11px] tracking-[0.25em] uppercase"
              style={{ border: `1px solid ${TUSCAN}30`, color: SADDLE }}
            >
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
            <div
              key={img.id}
              className="rounded-2xl overflow-hidden group relative"
              style={{ border: `1px solid ${TUSCAN}15`, opacity: img.isActive ? 1 : 0.5 }}
            >
              <div className="relative w-full h-36">
                <Image src={img.src} alt={img.alt ?? ""} fill className="object-cover" unoptimized />
              </div>
              <div className="px-3 py-2" style={{ background: "#fff" }}>
                {editingAlt?.id === img.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      autoFocus
                      value={editingAlt.value}
                      onChange={(e) => setEditingAlt({ id: img.id, value: e.target.value })}
                      onBlur={() => saveAlt(img.id, editingAlt.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveAlt(img.id, editingAlt.value);
                        if (e.key === "Escape") setEditingAlt(null);
                      }}
                      className="flex-1 min-w-0 font-dm text-xs outline-none border-b"
                      style={{ borderColor: TUSCAN, color: SADDLE }}
                    />
                    {altSaving === img.id && <Loader2 size={11} className="animate-spin flex-shrink-0" style={{ color: TUSCAN }} />}
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingAlt({ id: img.id, value: img.alt ?? "" })}
                    className="w-full flex items-center gap-1.5 group/alt text-left rounded-md px-1.5 py-0.5 -mx-1.5 transition-all hover:bg-amber-50"
                    title="Click to edit alt text"
                  >
                    <span className="font-dm text-xs truncate flex-1" style={{ color: img.alt ? SADDLE : `${SADDLE}40` }}>
                      {img.alt || "Add alt text…"}
                    </span>
                    <Pencil size={10} className="flex-shrink-0 transition-colors text-emerald-500 group-hover/alt:text-amber-400" />
                  </button>
                )}
                {img.category && (
                  <p className="font-cinzel text-[11px] tracking-[0.2em] uppercase mt-0.5" style={{ color: `${SADDLE}50` }}>{img.category}</p>
                )}
              </div>
              <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => toggle(img)}
                  disabled={saving === img.id}
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "#fff", border: `1px solid ${TUSCAN}30` }}
                >
                  {img.isActive ? <EyeOff size={12} style={{ color: SADDLE }} /> : <Eye size={12} style={{ color: "#10B981" }} />}
                </button>
                <button
                  onClick={() => remove(img.id)}
                  disabled={saving === img.id}
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "#FEE2E2", border: "1px solid #FECACA" }}
                >
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
