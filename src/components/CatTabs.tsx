"use client"

import Link from 'next/link'
import React from 'react'

function CatTabs() {
  return (
    <div className='px-5'>
      <Link href="/?category=business" className='ml-4 px-4 py-2 bg-blue-600 rounded'>Business</Link>
      <Link href="/?category=technology" className='ml-4 px-4 py-2 bg-blue-600 rounded'>Technology</Link>
      <Link href="/?category=science" className='ml-4 px-4 py-2 bg-blue-600 rounded'>Science</Link>
      <Link href="/?category=health" className='ml-4 px-4 py-2 bg-blue-600 rounded'>Health</Link>
      <Link href="/?category=entertainment" className='ml-4 px-4 py-2 bg-blue-600 rounded'>Entertainment</Link>
      <Link href="/?category=sports" className='ml-4 px-4 py-2 bg-blue-600 rounded'>Sports</Link>
      <Link href="/?category=politics" className='ml-4 px-4 py-2 bg-blue-600 rounded'>Politics</Link>
      <Link href="/?category=world" className='ml-4 px-4 py-2 bg-blue-600 rounded'>World</Link>
    </div>
  )
}

export default CatTabs
