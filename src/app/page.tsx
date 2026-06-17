import { Suspense } from "react";
import { getNews } from "@/lib/getNews";
import CatTabs from "@/components/CatTabs";
import NewsFeed from "@/components/NewsFeed";
import Loading from "./loading";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; country?: string }>;
}) {
  const { category, country } = await searchParams;

  const data = await getNews(category, undefined, country);

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 dark:bg-black">
      <Suspense fallback={null}>
        <CatTabs />
      </Suspense>
      <Suspense key={`${category ?? "all"}-${country ?? "all"}`} fallback={<Loading />}>
        <NewsFeed articles={data.articles} nextPage={data.nextPage} />
      </Suspense>
    </div>
  );
}