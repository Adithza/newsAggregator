import NewsCard from '@/components/NewsCard';
import NewsFeed from '@/components/NewsFeed';
import React from 'react'

async function SearchPage({searchParams,}: {
  searchParams: Promise<{ query?: string }>;
}) { //check later
  const { query } = await searchParams;

  console.log(query)

  const res = await fetch(`http://localhost:3000/api/search?query=` + encodeURIComponent(query? query : ''));
  const data = await res.json();

  if(!data.success){
    return (
      <div className='flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
        <h1>Search Page</h1>
        <p>Error fetching articles: {data.error}</p>
      </div>
    )
  }

  const articles = data.articles;


  return (
    <div className='flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <h1>Search Page</h1>
      <NewsFeed articles={articles} nextPage={data.nextPage} />
    </div>
  )
}

export default SearchPage
