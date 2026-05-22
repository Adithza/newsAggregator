import { Suspense } from "react";
import { getNews } from "@/lib/getNews";
import CatTabs from "@/components/CatTabs";
import NewsFeed from "@/components/NewsFeed";
import Loading from "./loading";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

   const data = await getNews(category);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <CatTabs />
      <Suspense key={category || "all"} fallback={<Loading />}>
        <NewsFeed articles={data.articles} nextPage={data.nextPage} />
      </Suspense>
    </div>
  );
}