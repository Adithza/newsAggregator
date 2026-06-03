"use client"

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import { useSearch } from './searchContext';
import { Search } from 'lucide-react';


function SearchBar() {
  const { searchTerm, setSearchTerm } = useSearch();
  const { categories, setCategories } = useSearch();
  const [timeframe, setTimeframe] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  const toggleCategory = (value: string) => {
    if (categories.includes(value)) {
      setCategories(categories.filter((category: string) => category !== value))
    } else {
      setCategories([...categories, value])
    }
  }

  const categoryOptions = [
    { id: 'Sports', value: 'sports', label: 'Sports' },
    { id: 'Politics', value: 'politics', label: 'Politics' },
    { id: 'Business', value: 'business', label: 'Business' },
    { id: 'Technology', value: 'technology', label: 'Technology' },
    { id: 'Science', value: 'science', label: 'Science' },
    { id: 'Health', value: 'health', label: 'Health' },
    { id: 'Entertainment', value: 'entertainment', label: 'Entertainment' },
    { id: 'World', value: 'world', label: 'World' },
  ]

  return (
    <div className='items-center sticky top-20 z-50 bg-black rounded-lg w-full max-w-lg'>
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
        if (timeframe) params.set("timeframe", timeframe)

        router.push(`/searchPage?${params.toString()}`);
        console.log('Searching for:', searchTerm, 'categories:', categories, 'timeframe:', timeframe);
      }}>
        <div>
          <Search className='absolute ml-3 mt-3 text-gray-400' size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for news..."
            className=" pl-12 pr-12 py-2 md:py-2.5 w-full bg-gray-900   rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-gray-800 transition-all"
          />
        </div>

        {categoryOptions.map((option) => (
          <div key={option.id}>
            <input
              type="checkbox"
              id={option.id}
              name="category"
              value={option.value}
              checked={categories.includes(option.value)}
              onChange={() => toggleCategory(option.value)}
              className='text-white'
            />
            <label htmlFor={option.id} className='ml-2 text-sm text-gray-400'>
              {option.label}
            </label>
          </div>
        ))}

        <div>
          <select
            name='timeframe'
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className='bg-gray-900 text-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value="">Any Time</option>
            <option value="1">Last Hour</option>
            <option value="12">Last 12 Hours</option>
            <option value="24">Last 24 Hours</option>
            <option value="48">Last 2 days</option>
          </select>
        </div>
      </form>
    </div>
  )
}

export default SearchBar
