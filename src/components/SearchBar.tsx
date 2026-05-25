"use client"

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from "lucide-react";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <div className='items-center'>
      <form onSubmit={(e) => {
        e.preventDefault();
        const params = new URLSearchParams({ query: searchTerm })
        const country = searchParams.get("country")
        if (country) params.set("country", country)
        router.push(`/searchPage?${params.toString()}`);
        console.log('Searching for:', searchTerm);
      }}>
        <Search className='absolute ml-3 mt-3 text-gray-400' size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for news..."
          className=" pl-12 pr-12 py-2 md:py-2.5 w-56 bg-gray-900   rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-gray-800 transition-all"
        />
      </form>
    </div>
  )
}

export default SearchBar
