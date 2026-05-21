export function DesktopCardSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden shimmer-light"
      style={{ aspectRatio: "3 / 4", background: "rgba(132,87,47,0.08)" }}
    />
  );
}

export function MobileCardSkeleton() {
  return (
    <div className="flex items-stretch gap-4">
      <div className="flex-shrink-0 w-28 h-28 rounded-2xl shimmer-light" style={{ background: "rgba(132,87,47,0.08)" }} />
      <div className="flex-1 rounded-2xl px-5 py-4 space-y-2" style={{ background: "rgba(132,87,47,0.05)" }}>
        <div className="h-1 w-6 rounded-full" style={{ background: "rgba(132,87,47,0.15)" }} />
        <div className="h-4 rounded-lg w-3/4 shimmer-light" style={{ background: "rgba(132,87,47,0.10)" }} />
        <div className="h-3 rounded w-full shimmer-light" style={{ background: "rgba(132,87,47,0.07)" }} />
        <div className="h-3 rounded w-5/6 shimmer-light" style={{ background: "rgba(132,87,47,0.07)" }} />
      </div>
    </div>
  );
}
