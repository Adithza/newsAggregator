import React, { Suspense } from 'react'
import SearchBar from './SearchBar'
import Link from 'next/link'
import CountryFilter from './CountryFilter'

function Navbar() {
  return (
    <div className='bg-gray-950 shadow-md w-screen h-16 py-4 px-8 flex items-center sticky top-0'>
      <Link href="/" className=" text-lg md:text-2xl font-bold bg-linear-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent whitespace-nowrap">
        DailyPlanet
      </Link>
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-end gap-4 ml-4">
            <div className="h-7 w-40 bg-gray-800 rounded animate-pulse" />
            <div className="h-10 w-56 bg-gray-800 rounded-lg animate-pulse" />
          </div>
        }
      >
        <CountryFilter />
        <div className='ml-auto'><SearchBar /></div>
      </Suspense>
    </div>
  )
}

export default Navbar
