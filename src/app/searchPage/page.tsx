import NewsCard from '@/components/NewsCard';
import React from 'react'

async function SearchPage({searchParams,}: {
  searchParams: Promise<{ query?: string }>;
}) { //check later
  const { query } = await searchParams;

  console.log(query)

  const res = await fetch(`http://localhost:3000/api/search?query=` + encodeURIComponent(query? query : ''));
  const articles = await res.json();


  return (
    <div className='flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <h1>Search Page</h1>
      {articles.success ? (
        <div className="w-1/2 justify-center">
          {articles.articles.map((article: any, index: number) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>
      ) : (
        <p>Error fetching articles: {articles.error}</p>
      )}
    </div>
  )
}

export default SearchPage
