"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { Search } from "lucide-react";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  return (
    <div className='items-center'>
      <form onSubmit={(e) => {
        e.preventDefault();
        router.push(`/searchPage?query=${encodeURIComponent(searchTerm)}`);
        console.log('Searching for:', searchTerm);
      }}>
        <Search className='absolute ml-3 mt-3 text-gray-400' size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for news..."
          className=" pl-12 pr-12 py-2.5 bg-gray-900   rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-gray-800 transition-all"
        />
      </form>
    </div>
  )
}

export default SearchBar
