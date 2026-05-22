import { Suspense } from "react";
import NewsFeed from '@/components/NewsFeed';
import React from 'react';
import Loading from "./loading";
import { searchNews } from "@/lib/searchNews";


async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string, category?: string }>;
}) {
  const { query, category } = await searchParams;
  const data = await searchNews(category, undefined, query);

  return (
    <div className='flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <Suspense key={query || ""} fallback={<Loading/>}>
        <NewsFeed articles={data.articles} nextPage={data.nextPage} />
      </Suspense>
    </div>
  );
}

export default SearchPage;
