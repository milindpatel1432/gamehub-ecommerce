export default function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gaming-border bg-gaming-card/35 p-4 space-y-4 animate-pulse">
      {/* Aspect-ratio cover image block */}
      <div className="aspect-[4/3] w-full rounded-xl bg-gaming-black/60" />
      
      {/* Title block */}
      <div className="h-4 bg-gaming-black/60 rounded-md w-3/4" />
      
      {/* Platform badge block */}
      <div className="h-3 bg-gaming-black/60 rounded-md w-1/3" />
      
      {/* Price block & button */}
      <div className="flex items-center justify-between pt-2 border-t border-gaming-border/20">
        <div className="h-4.5 bg-gaming-black/60 rounded-md w-1/4" />
        <div className="h-8 bg-gaming-black/60 rounded-lg w-20" />
      </div>
    </div>
  );
}
