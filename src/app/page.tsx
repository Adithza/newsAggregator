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

  const res = await fetch(`http://localhost:3000/api/news?${params.toString()}`);
  const data = await res.json();

  if(!data.success){
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <h1>Home Page</h1>
        <p>Error fetching articles: {data.error}</p>
      </div>
    )
  }

  const articles = data.articles;


  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>Home Page</h1>
      <NewsFeed articles={articles} nextPage={data.nextPage} />
    </div>
  );
}
