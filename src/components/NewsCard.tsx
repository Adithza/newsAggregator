"use client"
import Image from 'next/image'
import React from 'react'

function NewsCard({article}: {article: any}) {

  console.log(article)

  return (
    <div key={article.id} className="bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className='h-48 overflow-hidden bg-gray-200'>
            <img src={article.thumbnail || "/image.png"} alt="Article Image" onError={(e) => e.currentTarget.src = "/image.png"} className="w-full h-full object-cover" />
        </div>
        <div className='p-5 space-y-2'>
            <h2 className="text-l lg:text-xl font-bold line-clamp-2">{article.title}</h2>
            <div className='flex gap-2'>
              <p className="text-xs lg:text-sm text-gray-600">{new Date(article.publishedAt).toLocaleString("en-IN")}</p>
              <p className='text-xs lg:text-sm text-gray-300 pl-2'>{article.source}</p>
              <p className='text-xs lg:text-sm text-gray-300 pl-2'>{article.country? article.country : ""}</p>
            </div>
            <p className='text-xs lg:text-sm line-clamp-2'>{article.content}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              Read more
            </a>
        </div>
    </div>
  )
}

export default NewsCard
