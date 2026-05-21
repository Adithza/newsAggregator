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
    <div className='px-4'>
      {categories.map((category) => {
        const isActive = activeCategory === category;

        return (
          <Link
            key={category}
            href={`/?category=${category}`}
            className={`
              ml-4 px-4 py-2 rounded transition-colors
              ${
                isActive
                  ? "bg-white text-black"
                  : "bg-blue-600 text-white hover:bg-blue-500"
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
