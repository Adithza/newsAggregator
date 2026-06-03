"use client"
import React, { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NewsCard from './NewsCard'
import { useSearch } from './searchContext'
import { useRouter } from 'next/navigation'

function NewsFeed({ articles: initialArticles, nextPage: initialNextPage}: any) {

  const router = useRouter()
  const searchParams = useSearchParams()
  const { categories } = useSearch()
  const categoryString = categories.join(',')
  const query = searchParams.get('query')
  const country = searchParams.get('country')
  const timeframe = searchParams.get('timeframe')
  const { setSearchTerm, searchTerm } = useSearch()

  const [articles, setArticles] = useState(initialArticles || [])
  const [nextPage, setNextPage] = useState(initialNextPage)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(!!initialNextPage)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [retryAt, setRetryAt] = useState<number | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const isLocalSearchActive = !!searchTerm.trim()
  console.log("Local search active?", isLocalSearchActive, "Search term:", searchTerm)

  useEffect(() => {
    setArticles(initialArticles || [])
    setNextPage(initialNextPage)
    setHasMore(!!initialNextPage)
    setIsLoading(false)
    setIsRateLimited(false)
    setRetryAt(null)
  }, [initialArticles, initialNextPage, categoryString, query, country, timeframe])

  const fetchMoreArticles = React.useCallback(async (options?: { similar?: boolean }) => {
    if (isLoading || !hasMore || !nextPage || isRateLimited) return

    const loadSimilar = options?.similar ?? false

    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', nextPage)
      if (categories.length > 0) {
        categories.forEach((category) => params.append('category', category))
      }
      const useSearchQuery = query || searchTerm 
      if (useSearchQuery) {
        params.append('query', query || searchTerm)
      }
      if (country) {
        params.append('country', country)
      }
      if (timeframe) {
        params.append('timeframe', timeframe)
      }

      const endpoint = useSearchQuery ? '/api/search' : '/api/news'
      const res = await fetch(`${endpoint}?${params.toString()}`)
      const data = await res.json()

      const errorMessage = data?.error || res.statusText
      const isLimitError = res.status === 429 || String(errorMessage).toLowerCase().includes('rate limit')

      if (res.ok && data.success) {
        if (!Array.isArray(data.articles) || data.articles.length === 0) {
          setHasMore(false)
          setNextPage(undefined)
          return
        }

        setArticles((prev: any) => {
          const existingUrls = new Set(prev.map((article: any) => article.url));

          const uniqueNewArticles = data.articles.filter(
            (article: any) => !existingUrls.has(article.url)
          );

          return [...prev, ...uniqueNewArticles];
        });
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
  }, [categoryString, query, country, timeframe, hasMore, isLoading, isRateLimited, nextPage, searchTerm])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isRateLimited && !isLocalSearchActive) {
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
  }, [fetchMoreArticles, hasMore, isLoading, isRateLimited, isLocalSearchActive])

  const pathname = usePathname()
  const handleLoadSimilar = () => {
    if (!searchTerm.trim()) return

    const params = new URLSearchParams({ query: searchTerm.trim() })
    if (country) params.set("country", country)

    if(pathname === '/') {
      params.set("category", searchParams.get("category") ?? "")
      router.push(`/searchPage?${params.toString()}`)
      setSearchTerm("")
    }else{
      categories.forEach((category) => params.append('category', category))
      router.push(`/searchPage?${params.toString()}`)
      setSearchTerm("")
    }

    
  }

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

  const filteredArticles = isLocalSearchActive
    ? articles.filter((article: any) =>
        article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : articles

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12'>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredArticles.map((article: any) => (
          <NewsCard key={article.url} article={article} />
        ))}

        <div ref={sentinelRef} className="col-span-full py-8 text-center">
          {isLocalSearchActive && !isLoading && !isRateLimited && (
            <button
              type="button"
              onClick={handleLoadSimilar}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
            >
              Load articles related to "{searchTerm}" ?
            </button>
          )}
          {isLoading && (
            <p className="text-gray-500">Loading more articles...</p>
          )}
          {isRateLimited && (
            <p className="text-gray-500">
              Rate limit reached. Try again later.
            </p>
          )}
          {!isLocalSearchActive && !hasMore && !isRateLimited && articles.length > 0 && (
            <p className="text-gray-500">No more articles</p>
          )}
        </div>

      </div>
    </div>
  )
}

export default NewsFeed
