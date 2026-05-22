import React from "react";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-900 rounded-lg shadow-md overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-800" />
            <div className="p-5 space-y-3">
              <div className="h-6 bg-gray-800 rounded w-full" />
              <div className="h-6 bg-gray-800 rounded w-2/3" />
              <div className="flex gap-4 pt-1">
                <div className="h-4 bg-gray-800 rounded w-24" />
                <div className="h-4 bg-gray-800 rounded w-16" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-3 bg-gray-800 rounded w-full" />
                <div className="h-3 bg-gray-800 rounded w-5/6" />
              </div>
              <div className="h-4 bg-gray-800 rounded w-16 pt-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}