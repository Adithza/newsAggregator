import React from 'react'
import SearchBar from './SearchBar'
import CatTabs from './CatTabs'
import Link from 'next/link'

function Navbar() {
  return (
    <div className='bg-gray-950 shadow-md w-screen h-16 py-4 px-8 flex items-center sticky top-0'>
      <Link href="/" className="text-2xl font-bold bg-linear-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent whitespace-nowrap">
        DailyPlanet
      </Link>
      <div className='ml-auto'><SearchBar /></div>
    </div>
  )
}

export default Navbar
