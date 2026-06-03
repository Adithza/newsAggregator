import { Suspense } from "react";
import NewsFeed from '@/components/NewsFeed';
import Loading from "./loading";
import { searchNews } from "@/lib/searchNews";
import SearchBar from "@/components/GlobalSearchBar";


async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string | string[]; category?: string | string[]; country?: string | string[]; timeframe?: string | string[] }>;
}) {
  const { query, category, country, timeframe } = await searchParams;
  const queryValue = Array.isArray(query) ? query[0] : query
  const countryValue = Array.isArray(country) ? country[0] : country
  const categoryValues = Array.isArray(category) ? category : category ? [category] : undefined
  const timeframeValue = Array.isArray(timeframe) ? timeframe[0] : timeframe
  const data = await searchNews(categoryValues, undefined, queryValue, countryValue, timeframeValue);
  const hasSearchParams = Boolean(queryValue?.trim() || categoryValues?.length || timeframeValue)

  if (!hasSearchParams) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
      <SearchBar />
    </div>
  );
}

return (
  <div className="flex flex-1 bg-zinc-50 dark:bg-black">
    <div className="flex-1">
      <Suspense
        key={`${queryValue ?? ""}-${countryValue ?? "all"}-${categoryValues?.join(",") ?? "all"}`}
        fallback={<Loading />}
      >
        <NewsFeed articles={data.articles} nextPage={data.nextPage} />
      </Suspense>
    </div>

    <div className="shrink-0  pr-10  z-50">
      <SearchBar />
    </div>
  </div>
);
}

export default SearchPage;
