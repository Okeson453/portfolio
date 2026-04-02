export default function BlogLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page header skeleton */}
      <div className="space-y-4 mb-12">
        <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
      </div>

      {/* Blog post skeletons */}
      <div className="space-y-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg space-y-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full" />
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-4/5" />
            <div className="flex gap-2 pt-2">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-16" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
