export default function ProjectsLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Page header skeleton */}
            <div className="space-y-4 mb-12 text-center">
                <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded mx-auto w-1/2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mx-auto w-2/3" />
            </div>

            {/* Project cards skeleton grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="p-6 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
                        {/* Image placeholder */}
                        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded" />

                        {/* Title */}
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />

                        {/* Description lines */}
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                        </div>

                        {/* Tags */}
                        <div className="flex gap-2 pt-2">
                            {[...Array(2)].map((_, j) => (
                                <div key={j} className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                            ))}
                        </div>

                        {/* Links */}
                        <div className="flex gap-2 pt-2">
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
