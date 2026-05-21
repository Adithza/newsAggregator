import React from 'react'

function NewsCard({article}: {article: any}) {
  return (
    <div key={article.id} className="border p-4 mb-4 rounded">
            <h2 className="text-xl font-bold">{article.title}</h2>
            <p className="text-sm text-gray-600">{new Date(article.publishedAt).toLocaleString()}</p>
            <p className='text-sm text-gray-300'>{article.source}</p>
            <p className='line-clamp-2'>{article.content}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              Read more
            </a>
    </div>
  )
}

export default NewsCard
