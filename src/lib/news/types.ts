export type Article = {
  title: string
  url: string
  source: string
  publishedAt: string
  content?: string
  thumbnail: string
  category?: string[]
  country?: string | string[]
  byline?: string
}

export type FetchMode = "headlines" | "search"

export type FetchRequest = {
  mode: FetchMode
  query?: string
  category?: string
  country?: string
  cursor?: string | number
}

export type ProviderResult = {
  articles: Article[]
  nextCursor?: string | number
}

export type PaginationState = {
  guardianPage?: number
  newsCursor?: string
  currentNewsCursor?: string | number
}

export type NewsPageResult = {
  success: true
  articles: Article[]
  nextPage?: string
}

export type FetchNewsInput = {
  category?: string
  page?: string
  query?: string
  country?: string
}
