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

  const res = await fetch(`http://localhost:3000/api/news?${params.toString()}`, {cache: 'no-store'});
  const articles = await res.json();


  

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>Home Page</h1>
      {articles.success ? (
        <div>
          {articles.articles.map((article: any, index: number) => (
            <div key={index} className="border p-4 mb-4 rounded">
              <h2 className="text-xl font-bold">{article.title}</h2>
              <p className="text-sm text-gray-600">{new Date(article.publishedAt).toLocaleString()}</p>
              <p className='text-sm text-gray-300'>{article.source}</p>
              <p className='line-clamp-2'>{article.content}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                Read more
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p>Error fetching articles: {articles.error}</p>
      )}
    </div>
  );
}
