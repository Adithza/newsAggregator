"use client";

import { useSearch } from "./searchContext";
import { Filter } from "lucide-react";
export default function LocalSearch() {
  const { searchTerm, setSearchTerm } = useSearch();

  return (
    <div>
      <a href="/searchPage"><Filter className='absolute ml-3 mt-3 text-gray-400' size={20} /></a>
      <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search articles..."
      className=" pl-12 pr-12 py-2 md:py-2.5 w-56 bg-gray-900   rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-gray-800 transition-all"
    />
    </div>
    
  );
}