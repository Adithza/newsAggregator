"use client"

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { use } from 'react'
import { CATEGORY_MAP } from '../lib/category_map'

function CatTabs() {

  const searchParams = useSearchParams()
  const activeCategory = searchParams.get("category")

  const categories = Object.keys(CATEGORY_MAP)

  return (
    <div className='flex gap-4 overflow-x-auto scrollbar-hide scrollbar-hide py-6 md:px-12 justify-center sticky top-16 z-40 bg-black w-full'>
      {categories.map((category) => {
        const isActive = activeCategory === category;

        return (
          <Link
            key={category}
            href={`/?category=${category}`}
            className={`
              px-5 py-2 rounded-sm text-lg font-medium whitespace-nowrap transition-all duration-200
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
