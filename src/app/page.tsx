import { Suspense } from "react";
import CatTabs from "@/components/CatTabs";
import NewsFeed from "@/components/NewsFeed";
import Loading from "./loading";
import next from "next";

async function NewsFeedFetcher({ params }: { params: URLSearchParams }) {
  const origin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT || 3000}`;

  const res = await fetch(`${origin}/api/news?${params.toString()}`, {next: { revalidate: 300 }});
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`News API request failed with status ${res.status}: ${body}`);
  }
  const data = await res.json();

  if (!data.success) {
    throw new Error(data.error || "Failed to fetch articles");
  }

  return <NewsFeed articles={data.articles} nextPage={data.nextPage} />;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const params = new URLSearchParams();
  if (category) {
    params.append("category", category);
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <CatTabs />
      <Suspense key={category || "all"} fallback={<Loading />}>
        <NewsFeedFetcher params={params} />
      </Suspense>
    </div>
  );
}
