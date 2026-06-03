import { Suspense } from "react";
import NewsFeed from '@/components/NewsFeed';
import Loading from "./loading";
import { searchNews } from "@/lib/searchNews";
import SearchBar from "@/components/GlobalSearchBar";


async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string | string[]; category?: string | string[]; country?: string | string[]; startDate?: string | string[]; endDate?: string | string[] }>;
}) {
  const { query, category, country, startDate, endDate } = await searchParams;
  const queryValue = Array.isArray(query) ? query[0] : query
  const countryValue = Array.isArray(country) ? country[0] : country
  const categoryValues = Array.isArray(category) ? category : category ? [category] : undefined
  const startDateValue = Array.isArray(startDate) ? startDate[0] : startDate
  const endDateValue = Array.isArray(endDate) ? endDate[0] : endDate
  const data = await searchNews(categoryValues, undefined, queryValue, countryValue, startDateValue, endDateValue);
  const hasSearchParams = Boolean(queryValue?.trim() || categoryValues?.length || startDateValue || endDateValue)

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
