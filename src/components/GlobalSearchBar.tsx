"use client"

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from "lucide-react";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()

  const toggleCategory = (value: string) => {
    setCategories((prev) =>
      prev.includes(value)
        ? prev.filter((category) => category !== value)
        : [...prev, value]
    )
  }

  return (
    <div className='items-center'>
      <form onSubmit={(e) => {
        e.preventDefault();
        const params = new URLSearchParams()
        if (searchTerm.trim()) {
          params.set('query', searchTerm.trim())
        }

        categories.forEach((category) => {
          params.append('category', category)
        })

        const country = searchParams.get("country")
        if (country) params.set("country", country)

        router.push(`/searchPage?${params.toString()}`);
        console.log('Searching for:', searchTerm, 'categories:', categories);
      }}>
        <div>
          <Search className='absolute ml-3 mt-3 text-gray-400' size={20} />
          <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for news..."
          className=" pl-12 pr-12 py-2 md:py-2.5 w-100 bg-gray-900   rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-gray-800 transition-all"
        />
        </div>
        <div>
          <input
            type="checkbox"
            id="Sports"
            name='category'
            value="sports"
            checked={categories.includes('sports')}
            onChange={() => toggleCategory('sports')}
            className='text-white'
          />
          <label htmlFor="Sports" className='ml-2 text-sm text-gray-400'>Sports</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="Politics"
            name='category'
            value="politics"
            checked={categories.includes('politics')}
            onChange={() => toggleCategory('politics')}
            className='text-white'
          />
          <label htmlFor="Politics" className='ml-2 text-sm text-gray-400'>Politics</label>
        </div>
      </form>
    </div>
  )
}

export default SearchBar
