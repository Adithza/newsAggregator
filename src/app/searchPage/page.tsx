import { Suspense } from "react";
import NewsFeed from '@/components/NewsFeed';
import Loading from "./loading";
import { searchNews } from "@/lib/searchNews";
import SearchBar from "@/components/GlobalSearchBar";


async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string | string[]; category?: string | string[]; country?: string | string[] }>;
}) {
  const { query, category, country } = await searchParams;
  const queryValue = Array.isArray(query) ? query[0] : query
  const countryValue = Array.isArray(country) ? country[0] : country
  const categoryValues = Array.isArray(category) ? category : category ? [category] : undefined
  const data = await searchNews(categoryValues, undefined, queryValue, countryValue);
  const hasSearchParams = Boolean(queryValue?.trim() || categoryValues?.length)

  return (
    <div className='flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <Suspense key={`${queryValue ?? ""}-${countryValue ?? "all"}-${categoryValues?.join(",") ?? "all"}`} fallback={<Loading/>}>
        {hasSearchParams ? (
          <NewsFeed articles={data.articles} nextPage={data.nextPage} />
        ) : (
          <div className="h-100">
            <SearchBar />
          </div>
        )}
      </Suspense>
    </div>
  );
}

export default SearchPage;
