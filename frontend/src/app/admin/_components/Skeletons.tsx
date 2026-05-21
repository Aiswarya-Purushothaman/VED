const S = "rgba(132,87,47,0.08)";
const SH = "rgba(132,87,47,0.13)";

function Bone({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`shimmer-light rounded-lg ${className ?? ""}`}
      style={{ background: S, ...style }}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Bone className="h-7 w-36" />
        <Bone className="h-4 w-72" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl p-6 shimmer-light" style={{ background: "#fff", border: "1px solid rgba(241,168,5,0.08)", boxShadow: "0 2px 12px rgba(241,168,5,0.04)" }}>
            <div className="flex items-center justify-between mb-4">
              <Bone className="h-2.5 w-20" />
              <div className="w-10 h-10 rounded-xl shimmer-light" style={{ background: SH }} />
            </div>
            <Bone className="h-8 w-16" />
          </div>
        ))}
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid rgba(241,168,5,0.08)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(241,168,5,0.1)" }}>
          <Bone className="h-4 w-36" />
          <Bone className="h-3 w-14" />
        </div>
        <div className="divide-y" style={{ borderColor: "rgba(241,168,5,0.06)" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-4">
              <div className="space-y-1.5">
                <Bone className="h-4 w-36" />
                <Bone className="h-3 w-52" />
              </div>
              <div className="flex items-center gap-3">
                <Bone className="h-3 w-20" />
                <Bone className="h-5 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BookingsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid rgba(241,168,5,0.1)" }}>
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Bone className="h-4 w-32" />
                <Bone className="h-5 w-20 rounded-full" />
              </div>
              <Bone className="h-3 w-64" />
              <Bone className="h-3 w-48" />
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Bone className="h-8 w-28 rounded-lg" />
              <Bone className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ServicesSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid rgba(241,168,5,0.1)" }}>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-14 h-14 rounded-xl shimmer-light flex-shrink-0" style={{ background: SH }} />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Bone className="h-4 w-36" />
                <Bone className="h-4 w-20 rounded-full" />
              </div>
              <div className="flex gap-3">
                <Bone className="h-3 w-24" />
                <Bone className="h-3 w-24" />
                <Bone className="h-3 w-24" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Bone className="h-8 w-8 rounded-lg" />
              <Bone className="h-8 w-8 rounded-lg" />
              <Bone className="h-7 w-7 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReviewsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-2xl px-5 py-4 flex gap-4" style={{ background: "#fff", border: "1px solid rgba(241,168,5,0.1)" }}>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Bone className="h-4 w-32" />
              <Bone className="h-3 w-20 rounded-full" />
            </div>
            <Bone className="h-4 w-full" />
            <Bone className="h-4 w-4/5" />
            <Bone className="h-3 w-48" />
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0">
            <Bone className="h-9 w-9 rounded-xl" />
            <Bone className="h-9 w-9 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function UsersSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid rgba(241,168,5,0.1)" }}>
      <div className="px-5 py-3 border-b flex gap-6" style={{ borderColor: "rgba(241,168,5,0.08)" }}>
        {[140, 180, 80, 80, 80, 80].map((w, i) => (
          <Bone key={i} className="h-2.5" style={{ width: w }} />
        ))}
      </div>
      <div className="divide-y" style={{ borderColor: "rgba(241,168,5,0.06)" }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-5 py-3.5">
            <div className="flex items-center gap-2" style={{ minWidth: 140 }}>
              <div className="w-8 h-8 rounded-full shimmer-light flex-shrink-0" style={{ background: SH }} />
              <Bone className="h-4 w-24" />
            </div>
            <Bone className="h-4 w-44" />
            <Bone className="h-5 w-16 rounded-full" />
            <Bone className="h-5 w-16 rounded-full" />
            <Bone className="h-3 w-20" />
            <div className="flex gap-2">
              <Bone className="h-8 w-8 rounded-lg" />
              <Bone className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(241,168,5,0.1)" }}>
          <div className="w-full h-36 shimmer-light" style={{ background: SH }} />
          <div className="px-3 py-2 space-y-1.5" style={{ background: "#fff" }}>
            <Bone className="h-3 w-3/4" />
            <Bone className="h-2.5 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
