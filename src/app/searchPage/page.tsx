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

  console.log("Category values:", categoryValues)

  if (!hasSearchParams) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4 bg-zinc-50 dark:bg-black">
      <SearchBar />
    </div>
  );
}

return (
  <div className="flex flex-1 bg-zinc-50 dark:bg-black">
    <div className="flex-1 pt-5">
      <Suspense
        key={`${queryValue ?? ""}-${countryValue ?? "all"}-${categoryValues?.join(",") ?? "all"}`}
        fallback={<Loading />}
      >
        <NewsFeed articles={data.articles} nextPage={data.nextPage} />
      </Suspense>
    </div>

    <div className="hidden lg:block shrink-0 w-1/4 pr-10">
    <div className="sticky top-20">
      <SearchBar />
    </div>
    </div>
  </div>
);
}

export default SearchPage;
