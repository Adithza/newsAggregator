// tests/api/news.spec.ts

import { test, expect } from '@playwright/test'



test.describe('GET /api/news', () => {
  test('returns articles', async ({ request }) => {
    const response = await request.get(
      'http://localhost:3000/api/news'
    )

    expect(response.ok()).toBeTruthy()

    const body = await response.json()

    expect(body.success).toBe(true)
    expect(Array.isArray(body.articles)).toBe(true)
  })

  test('returns nextPage cursor', async ({ request }) => {
    const response = await request.get(
      'http://localhost:3000/api/news'
    )

    const body = await response.json()

    expect(body).toHaveProperty('nextPage')
  })

  test('filters by category correctly', async ({ request }) => {
  const response = await request.get('/api/news?category=technology')
  const body = await response.json()

  expect(body.success).toBe(true)

  body.articles.forEach((article: any) => {
    expect(Array.isArray(article.category)).toBe(true)
    expect(article.category).toContain('technology')
  })
  })

  test('rejects invalid category', async ({ request }) => {
  const response = await request.get(
    'http://localhost:3000/api/news?category=notreal'
  )

  expect(response.status()).toBe(400)

  const body = await response.json()

  expect(body.success).toBe(false)
  expect(body.error).toBe('Invalid category')
  })

  test('all sources return consistent article shape', async ({ request }) => {
  const res = await request.get('/api/news')
  const body = await res.json()

  const article = body.articles[0]

  expect(article).toHaveProperty('title')
  expect(article).toHaveProperty('url')
  expect(article).toHaveProperty('category')
  expect(article).toHaveProperty('publishedAt')
  expect(article).toHaveProperty('source')
  expect(article).toHaveProperty('content')
  expect(article).toHaveProperty('thumbnail')
  })

  test('no duplicate articles by URL', async ({ request }) => {
  const res = await request.get('/api/news')
  const body = await res.json()

  const urls = body.articles.map((a: any) => a.url)
  const unique = new Set(urls)

  expect(unique.size).toBe(urls.length)
  })

  test('handles empty results gracefully', async ({ request }) => {
  const res = await request.get('/api/news?q=asdkjasdkjaskd')
  const body = await res.json()

  expect(Array.isArray(body.articles)).toBe(true)
  })

  test('publishedAt is a valid ISO date string', async ({ request }) => {
  const res = await request.get('/api/news')
  const body = await res.json()

  console.log(body)

  body.articles.forEach((article: any) => {
    const date = new Date(article.publishedAt)

    // must be a valid date
    expect(isNaN(date.getTime())).toBe(false)
  })
  })

  test('articles are sorted by newest first', async ({ request }) => {
  const res = await request.get('/api/news')
  const body = await res.json()

  for (let i = 1; i < body.articles.length; i++) {
    const prev = new Date(body.articles[i - 1].publishedAt).getTime()
    const curr = new Date(body.articles[i].publishedAt).getTime()

    expect(prev >= curr).toBe(true)
  }
  })

  test('rejects invalid date order', async ({ request }) => {
  const res = await request.get(
    '/api/news?startDate=2026-06-10&endDate=2026-06-01'
  )

  expect(res.status()).toBe(400)
  })


  test('rejects date range > 15 days', async ({ request }) => {
  const res = await request.get('/api/news?startDate=2026-01-01&endDate=2026-02-01')

  // 👇 ADD DEBUG HERE
  console.log('URL:', res.url())
  console.log('STATUS:', res.status())
  console.log('BODY:', await res.text())

  expect(res.status()).toBe(400)
  })
  
})


