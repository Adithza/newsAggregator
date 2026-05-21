import React from 'react'
import SearchBar from './SearchBar'
import CatTabs from './CatTabs'

function Navbar() {
  return (
    <div className='bg-gray-900 shadow-md w-screen h-16 py-4 px-8 flex'>
      SomeName
      <div><SearchBar /></div>
      <div><CatTabs /></div>
    </div>
  )
}

export default Navbar
