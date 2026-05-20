import React from 'react'

async function SearchPage({searchParams,}: {
  searchParams: Promise<{ query?: string }>;
}) { //check later
  const { query } = await searchParams;

  console.log(query)

  const res = await fetch(`http://localhost:3000/api/search?query=` + encodeURIComponent(query? query : ''), {cache: 'no-store'});
  const articles = await res.json();

  console.log(articles)


  return (
    <div>
      <h1>Search Page</h1>
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
  )
}

export default SearchPage
