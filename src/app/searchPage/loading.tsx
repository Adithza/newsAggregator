export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black px-4 py-6 flex justify-center">
      <div className="w-full max-w-2xl space-y-4">

        {/* Header skeleton */}
        <div className="h-8 w-2/3 bg-gray-300 dark:bg-gray-800 rounded animate-pulse" />

        {/* Tabs skeleton */}
        <div className="flex gap-3 overflow-hidden">
          <div className="h-8 w-16 bg-gray-300 dark:bg-gray-800 rounded-full animate-pulse" />
          <div className="h-8 w-20 bg-gray-300 dark:bg-gray-800 rounded-full animate-pulse" />
          <div className="h-8 w-14 bg-gray-300 dark:bg-gray-800 rounded-full animate-pulse" />
          <div className="h-8 w-18 bg-gray-300 dark:bg-gray-800 rounded-full animate-pulse" />
        </div>

        {/* News cards skeleton */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="p-5 space-y-3 border border-gray-200 dark:border-gray-800 rounded-xl"
          >
            {/* title */}
            <div className="h-5 w-full bg-gray-300 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-5 w-4/5 bg-gray-300 dark:bg-gray-800 rounded animate-pulse" />

            {/* meta row */}
            <div className="flex gap-3">
              <div className="h-3 w-24 bg-gray-300 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-3 w-20 bg-gray-300 dark:bg-gray-800 rounded animate-pulse" />
            </div>

            {/* content */}
            <div className="h-3 w-full bg-gray-300 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-3 w-11/12 bg-gray-300 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-3 w-3/4 bg-gray-300 dark:bg-gray-800 rounded animate-pulse" />

            {/* link */}
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}