"use client"
import React from 'react'
import NewsCard from './NewsCard'

function NewsFeed({articles, nextPage} : any) {

  const [allArticles, setAllArticles] = React.useState(articles);

  return (
    <div className='flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
        <div className="w-1/2 justify-center">
          {allArticles.map((article: any, index: number) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>
    </div>
  )
}

export default NewsFeed
