export default function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
      <div className="skeleton-shimmer aspect-[4/5] bg-mist" />
      <div className="space-y-3 p-4">
        <div className="skeleton-shimmer h-3 w-24 rounded-full bg-black/10" />
        <div className="skeleton-shimmer h-5 w-4/5 rounded-full bg-black/10" />
        <div className="skeleton-shimmer h-4 w-28 rounded-full bg-black/10" />
        <div className="flex items-center justify-between pt-2">
          <div className="skeleton-shimmer h-5 w-16 rounded-full bg-black/10" />
          <div className="skeleton-shimmer h-10 w-10 rounded-md bg-black/10" />
        </div>
      </div>
    </div>
  );
}
