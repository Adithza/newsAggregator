"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  return (
    <div className='ml-10'>
      <form onSubmit={(e) => {
        e.preventDefault();
        router.push(`/searchPage?query=${encodeURIComponent(searchTerm)}`);
        console.log('Searching for:', searchTerm);
      }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for news..."
          className="border rounded-l px-4 w-64 py-1.5 focus:outline-none"
        />
        <button type="submit" className="border bg-blue-500 text-white px-4 py-1.5 rounded-r  ">
          Search
        </button>
      </form>
    </div>
  )
}

export default SearchBar
