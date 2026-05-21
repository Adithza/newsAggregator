"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import NewsCard from './NewsCard'

function NewsFeed({articles: initialArticles, nextPage: initialNextPage} : any) {
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const query = searchParams.get('query')
  
  const [articles, setArticles] = useState(initialArticles || [])
  const [nextPage, setNextPage] = useState(initialNextPage)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(!!initialNextPage)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setArticles(initialArticles || [])
    setNextPage(initialNextPage)
    setHasMore(!!initialNextPage)
    setIsLoading(false)
  }, [initialArticles, initialNextPage, category, query])

  const fetchMoreArticles = React.useCallback(async () => {
    if (isLoading || !hasMore || !nextPage) return

    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', nextPage)
      if (category) {
        params.append('category', category)
      }
      if (query) {
        params.append('query', query)
      }

      const endpoint = query ? '/api/search' : '/api/news'
      const res = await fetch(`${endpoint}?${params.toString()}`)
      const data = await res.json()

      if (data.success) {
        setArticles((prev: any) => [...prev, ...data.articles])
        setNextPage(data.nextPage)
        setHasMore(!!data.nextPage)
      }
    } catch (error) {
      console.error('Error fetching more articles:', error)
    } finally {
      setIsLoading(false)
    }
  }, [category, query, hasMore, isLoading, nextPage])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchMoreArticles()
        }
      },
      { threshold: 0.1 }
    )

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current)
      }
    }
  }, [fetchMoreArticles, hasMore, isLoading])

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12'>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((article: any, index: number) => (
            <NewsCard key={index} article={article} />
          ))}
          
          <div ref={sentinelRef} className="py-8 text-center">
            {isLoading && <p className="text-gray-500">Loading more articles...</p>}
            {!hasMore && articles.length > 0 && <p className="text-gray-500">No more articles</p>}
          </div>
        </div>
    </div>
  )
}

export default NewsFeed
