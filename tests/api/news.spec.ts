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
  expect(article).toHaveProperty('byline')
  expect(article).toHaveProperty('thumbnail')
  })

})


