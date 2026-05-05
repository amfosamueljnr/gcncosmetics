export default function ProductSkeleton() {
  return (
    <div className="rounded-card bg-card shadow-card overflow-hidden">
      <div className="aspect-[3/4] bg-secondary animate-shimmer bg-gradient-to-r from-secondary via-muted to-secondary bg-[length:200%_100%]" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/4 rounded bg-secondary animate-shimmer bg-gradient-to-r from-secondary via-muted to-secondary bg-[length:200%_100%]" />
        <div className="h-4 w-1/3 rounded bg-secondary animate-shimmer bg-gradient-to-r from-secondary via-muted to-secondary bg-[length:200%_100%]" />
      </div>
    </div>
  );
}
