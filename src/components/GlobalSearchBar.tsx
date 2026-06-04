"use client"

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import { useSearch } from './searchContext';
import { Search } from 'lucide-react';


function SearchBar() {
  const { searchTerm, setSearchTerm } = useSearch();
  const { categories, setCategories } = useSearch();
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

const FIFTEEN_DAYS = 15;

const addDays = (dateStr: string, days: number) => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
};

const subtractDays = (dateStr: string, days: number) => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0];
};

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

  const today = new Date();

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const maxDate = today.toISOString().split("T")[0];
  const minDate = threeMonthsAgo.toISOString().split("T")[0];

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
        if (startDate) params.set("startDate", startDate)
        if (endDate) params.set("endDate", endDate)

        router.push(`/searchPage?${params.toString()}`);
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
          <div key={option.id} className='p-1'>
            <input
              type="checkbox"
              id={option.id}
              name="category"
              value={option.value}
              checked={categories.includes(option.value)}
              onChange={() => toggleCategory(option.value)}
              className='text-white'
            />
            <label htmlFor={option.id} className='ml-2 text-sm text-gray-400 font-semibold'>
              {option.label}
            </label>
          </div>
        ))}

        <div>
        <input
          type="date"
          value={startDate}
          min={minDate}
          max={
            endDate
              ? subtractDays(endDate, -FIFTEEN_DAYS) > maxDate
                ? maxDate
                  : addDays(endDate, 0)
                    : maxDate
          }
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-2 text-sm text-gray-400 bg-gray-900 rounded-sm"
          />

          <label className="mx-2 text-sm text-gray-400">to</label>

          <input
            type="date"
            value={endDate}
            min={startDate || minDate}
            max={
              startDate
                ? addDays(startDate, FIFTEEN_DAYS) < maxDate
                  ? addDays(startDate, FIFTEEN_DAYS)
                  : maxDate
                : maxDate
          }
          onChange={(e) => setEndDate(e.target.value)}
          className="mt-2 text-sm text-gray-400 bg-gray-900 rounded-sm"
        />
        </div>
        <label className="mt-2 text-sm text-gray-400">* Dates must be within the last 3 months and 15 days of each other</label>
      </form>
    </div>
  )
}

export default SearchBar
