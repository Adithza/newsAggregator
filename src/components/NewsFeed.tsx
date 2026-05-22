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
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [retryAt, setRetryAt] = useState<number | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setArticles(initialArticles || [])
    setNextPage(initialNextPage)
    setHasMore(!!initialNextPage)
    setIsLoading(false)
    setIsRateLimited(false)
    setRetryAt(null)
  }, [initialArticles, initialNextPage, category, query])

  const fetchMoreArticles = React.useCallback(async () => {
    if (isLoading || !hasMore || !nextPage || isRateLimited) return

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

      const errorMessage = data?.error || res.statusText
      const isLimitError = res.status === 429 || String(errorMessage).toLowerCase().includes('rate limit')

      if (res.ok && data.success) {
        setArticles((prev: any) => [...prev, ...data.articles])
        setNextPage(data.nextPage)
        setHasMore(!!data.nextPage)
      } else if (isLimitError) {
        const cooldownMs = 30_000
        setIsRateLimited(true)
        setRetryAt(Date.now() + cooldownMs)
        setHasMore(false)
        console.warn('Rate limit reached — pausing infinite scroll for 60s')
      } else {
        console.error('Error fetching more articles:', errorMessage)
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error fetching more articles:', error)
    } finally {
      setIsLoading(false)
    }
  }, [category, query, hasMore, isLoading, isRateLimited, nextPage])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isRateLimited) {
          observer.disconnect()
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
  }, [fetchMoreArticles, hasMore, isLoading, isRateLimited])

  useEffect(() => {
    if (!isRateLimited || retryAt === null) return

    const timeout = retryAt - Date.now()
    if (timeout <= 0) {
      setIsRateLimited(false)
      setHasMore(!!nextPage)
      setRetryAt(null)
      return
    }

    const timer = window.setTimeout(() => {
      setIsRateLimited(false)
      setHasMore(!!nextPage)
      setRetryAt(null)
    }, timeout)

    return () => window.clearTimeout(timer)
  }, [isRateLimited, nextPage, retryAt])

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12'>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((article: any, index: number) => (
            <NewsCard key={index} article={article} />
          ))}
          
          <div ref={sentinelRef} className="py-8 text-center">
            {isLoading && <p className="text-gray-500">Loading more articles...</p>}
            {isRateLimited && (
              <p className="text-gray-500">
                Rate limit reached. Try again later.
              </p>
            )}
            {!hasMore && !isRateLimited && articles.length > 0 && (
              <p className="text-gray-500">No more articles</p>
            )}
          </div>
        </div>
    </div>
  )
}

export default NewsFeed
