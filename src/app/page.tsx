import CatTabs from "@/components/CatTabs";
import NewsCard from "@/components/NewsCard";
import NewsFeed from "@/components/NewsFeed";
import Image from "next/image";

export default async function Home({searchParams,}: {
  searchParams: Promise<{ category?: string }>;
}) { //check later
  const { category } = await searchParams;

  console.log(category)

  const params = new URLSearchParams();
  if(category){
    params.append("category", category)
  }

  const origin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT || 3000}`;

  const res = await fetch(`${origin}/api/news?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`News API request failed with status ${res.status} ${data.error}`);
  }

  if (!data.success) {
    throw new Error(data.error || "Failed to fetch articles");
  }
  const articles = data.articles;


  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <CatTabs />
      <NewsFeed articles={articles} nextPage={data.nextPage} />
    </div>
  );
}
