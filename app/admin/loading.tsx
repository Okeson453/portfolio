export default function AdminLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
                <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-24" />
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                    </div>
                ))}
            </div>

            {/* Table skeleton */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-4">
                {/* Table header */}
                <div className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
                    ))}
                </div>

                {/* Table rows */}
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                        {[...Array(4)].map((_, j) => (
                            <div key={j} className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
