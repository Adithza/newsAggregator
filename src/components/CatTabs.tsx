"use client"

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import { CATEGORY_MAP } from '../lib/category_map'

function CatTabs() {

  const searchParams = useSearchParams()
  const activeCategory = searchParams.get("category")

  const categories = Object.keys(CATEGORY_MAP)

  return (
    <div className='flex md:gap-3 overflow-x-scroll scrollbar-hide scrollbar-hide py-6 sm:px-12 justify-start md:justify-center sticky top-16 z-40 bg-black w-full'>
      {categories.map((category) => {
        const isActive = activeCategory === category;

        const params = new URLSearchParams(searchParams.toString())
        params.set("category", category)

        return (
          <Link
            key={category}
            href={`/?${params.toString()}`}
            className={`
              px-2 md:px-4 lg:text-lg py-2 rounded-sm text-sm font-medium whitespace-nowrap transition-all duration-200
              ${
                isActive
                  ? " text-blue-600"
                  : "text-white hover:text-blue-400"
              }
            `}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Link>
        );
      })}
    </div>
  )
}

export default CatTabs
