"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSearch } from "./searchContext";
import { Filter } from "lucide-react";
export default function LocalSearch() {
  const { searchTerm, setSearchTerm } = useSearch();
  const searchParams = useSearchParams();
  const country = searchParams.get("country");
  const categories = searchParams.getAll("category");
  const router = useRouter()

  const pathname = usePathname()
  if(pathname !== '/searchPage') {
  return (
    <div>
      <a href="/searchPage"><Filter className='absolute ml-3 mt-3 text-gray-400' size={20} /></a>
      <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={(e)  => {
        if(e.key === 'Enter') {
          const params = new URLSearchParams()
          if(searchTerm.trim()) {
            params.append('query', searchTerm.trim())
          }
          if(country) {
            params.append('country', country)
          }
          categories.forEach((category) => {
            params.append('category', category)
          })
          setSearchTerm("")
          router.push(`/searchPage?${params.toString()}`)
        }
      }}
      placeholder="Search articles..."
      className=" pl-12 pr-12 py-2 md:py-2.5 w-56 bg-gray-900   rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-gray-800 transition-all"
    />
    </div>
    
  );
}}