import Image from 'next/image'
import React from 'react'

function NewsCard({article}: {article: any}) {

    

  return (
    <div key={article.id} className="border p-4 mb-4 rounded flex">
        <div className=''>
            <img src={article.thumbnail} alt="Article Image" className="w-48 h-34 lg:w-56 lg:h-40 object-cover rounded mr-4 shrink-0" />
        </div>
        <div className='flex-1 min-w-0'>
            <h2 className="text-l lg:text-xl font-bold line-clamp-2">{article.title}</h2>
            <p className="text-xs lg:text-sm text-gray-600">{new Date(article.publishedAt).toLocaleString()}</p>
            <p className='text-xs lg:text-sm text-gray-300'>{article.source}</p>
            <p className='text-xs lg:text-sm line-clamp-2'>{article.content}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              Read more
            </a>
        </div>
    </div>
  )
}

export default NewsCard
