"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black px-4 text-center">
      <h2 className="text-2xl font-bold text-red-500">
        Something went wrong
      </h2>

      <p className="text-gray-600 dark:text-gray-400 mt-2">
        {error.message}
      </p>

      <button
        onClick={() => reset()}
        className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg"
      >
        Retry
      </button>
    </div>
  );
}