import React from 'react'
import SearchBar from './SearchBar'
import CatTabs from './CatTabs'
import Link from 'next/link'

function Navbar() {
  return (
    <div className='bg-gray-900 shadow-md w-screen h-16 py-4 px-8 flex items-center'>
      <Link href="/" className='text-white font-bold text-lg'>
        SomeName
      </Link>
      <div><SearchBar /></div>
      <div><CatTabs /></div>
    </div>
  )
}

export default Navbar
