"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white gap-4">
      <h1 className="text-2xl font-bold text-red-500">
        Something went wrong
      </h1>

      <p>{error.message}</p>

      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          Retry
        </button>

        <a
            href="/"
            className="px-4 py-2 bg-gray-700 text-white rounded"
        >
        Home
        </a>
      </div>
    </div>
  );
}