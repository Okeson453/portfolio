import { Skeleton } from './skeleton';

export function ProjectCardSkeleton() {
  return (
    <div
      className="rounded-xl border border-border bg-card overflow-hidden"
      aria-label="Loading project..."
    >
      {/* Image placeholder */}
      <Skeleton className="h-48 w-full rounded-none" />

      <div className="p-5 space-y-3">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />

        {/* Description lines */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        {/* Tags */}
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>

        {/* Button */}
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
    </div>
  );
}
