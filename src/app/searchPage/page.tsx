import { Suspense } from "react";
import NewsFeed from '@/components/NewsFeed';
import React from 'react';
import Loading from "./loading";

async function SearchFeedFetcher({ query, category }: { query?: string, category?: string }) {
  const origin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT || 3000}`;

  const res = await fetch(`${origin}/api/search?query=` + encodeURIComponent(query ? query : '') + `&category=` + encodeURIComponent(category ? category : ''),
  {next: { revalidate: 300 }}
);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Search API request failed with status ${res.status}: ${body}`);
  }
  const data = await res.json();

  if (!data.success) {
    throw new Error(data.error || "Failed to fetch articles");
  }

  return <NewsFeed articles={data.articles} nextPage={data.nextPage} />;
}

async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string, category?: string }>;
}) {
  const { query, category } = await searchParams;

  return (
    <div className='flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <Suspense key={query || ""} fallback={<Loading/>}>
        <SearchFeedFetcher query={query} category={category} />
      </Suspense>
    </div>
  );
}

export default SearchPage;
