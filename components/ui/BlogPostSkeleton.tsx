import { Skeleton } from './skeleton';

export function BlogPostSkeleton() {
    return (
        <article
            className="flex gap-4 py-4 border-b border-border"
            aria-label="Loading article..."
        >
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-4/5" />      {/* Title */}
                <Skeleton className="h-4 w-full" />     {/* Excerpt line 1 */}
                <Skeleton className="h-4 w-3/4" />      {/* Excerpt line 2 */}
                <div className="flex gap-3 pt-1">
                    <Skeleton className="h-4 w-20" />    {/* Date */}
                    <Skeleton className="h-4 w-16" />    {/* Read time */}
                </div>
            </div>
            <Skeleton className="h-20 w-28 rounded-lg flex-shrink-0" />  {/* Thumbnail */}
        </article>
    );
}
