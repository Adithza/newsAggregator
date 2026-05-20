"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  return (
    <div>
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
          className="border rounded-l px-4 py-2 w-64"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r">
          Search
        </button>
      </form>
    </div>
  )
}

export default SearchBar
