import NewsCard from '@/components/NewsCard';
import NewsFeed from '@/components/NewsFeed';
import React from 'react'

async function SearchPage({searchParams,}: {
  searchParams: Promise<{ query?: string }>;
}) { //check later
  const { query } = await searchParams;

  console.log(query)

  const origin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT || 3000}`;

  const res = await fetch(`${origin}/api/search?query=` + encodeURIComponent(query? query : ''));
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Search API request failed with status ${res.status} ${data.error}`);
  }

  if(!data.success){
    throw new Error(data.error || "Failed to fetch articles");
  }

  const articles = data.articles;


  return (
    <div className='flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <NewsFeed articles={articles} nextPage={data.nextPage} />
    </div>
  )
}

export default SearchPage
