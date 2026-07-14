export default function SkeletonTable({ rows = 4, cols = 5 }) {
  return (
    <div className="w-full rounded-2xl border border-gaming-border bg-gaming-card/35 p-6 animate-pulse space-y-4">
      {/* Header mock row */}
      <div className="flex gap-4 border-b border-gaming-border/40 pb-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-gaming-black/60 rounded-md flex-1" />
        ))}
      </div>
      
      {/* Table rows list mock */}
      <div className="space-y-4 pt-2">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className="h-6.5 bg-gaming-black/45 rounded-lg flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
