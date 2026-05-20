import Link from 'next/link'
import React from 'react'

function CatTabs() {
  return (
    <div>
      <Link href="/searchPage?category=business" className='px-4 py-2 bg-gray-200 rounded'>Business</Link>
      <Link href="/searchPage?category=technology" className='px-4 py-2 bg-gray-200 rounded'>Technology</Link>
      <Link href="/searchPage?category=sports" className='px-4 py-2 bg-gray-200 rounded'>Sports</Link>
    </div>
  )
}

export default CatTabs
