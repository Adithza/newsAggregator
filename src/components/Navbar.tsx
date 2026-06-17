import React, { Suspense} from 'react'
import SearchBar from './GlobalSearchBar'
import Link from 'next/link'
import CountryFilter from './CountryFilter'
import LocalSearch from './localSearch'
import GlobalSearchBar from './GlobalSearchBar'
import { Search, MenuIcon } from 'lucide-react'
import { SheetTrigger, SheetContent , Sheet} from './ui/sheet'


function Navbar() {

  return (
    <div className="bg-gray-950 shadow-md fixed top-0 left-0 right-0 h-16 py-4 px-4 sm:px-8 flex items-center z-50 w-full gap-4">
      <Link href="/" className="text-lg md:text-2xl font-bold bg-linear-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent whitespace-nowrap">
        <span className='hidden md:inline'>DailyPlanet</span>
        <span className='md:hidden'>DP</span>
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
        <div className='ml-auto'><LocalSearch /></div>
        <Sheet>
          <SheetTrigger asChild>
            <button className="md:hidden">
            <MenuIcon size={24} />
            </button>
        </SheetTrigger>

        <SheetContent side="right">
          <div className='p-4'><SearchBar /></div>
        </SheetContent>
        </Sheet>
      </Suspense>
    </div>
  )
}

export default Navbar
