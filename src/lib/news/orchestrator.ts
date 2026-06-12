import { aggregateArticles } from "@/lib/aggregate"
import { CATEGORY_MAP } from "@/lib/category_map"
import { normalizeCategories } from "@/lib/normalize"
import { decodePagination, encodePagination } from "./pagination"
import { assertProvidersConfigured, getActiveProviders } from "./registry"
import type {
  Article,
  FetchNewsInput,
  FetchRequest,
  NewsPageResult,
  PaginationState,
} from "./types"
import type { ProviderId } from "./providers/types"

function pickCursor(
  id: ProviderId,
  state: PaginationState
): string | number | undefined {
  switch (id) {
    case "guardian":
      return state.guardianPage
    case "newsdata":
      return state.newsCursor
    case "currents":
      return state.currentNewsCursor
  }
}

function normalizeArticleCategories(category: unknown): string[] {
  if (Array.isArray(category)) return normalizeCategories(category)
  if (category) return normalizeCategories([String(category)])
  return []
}

export async function fetchNews(input: FetchNewsInput): Promise<NewsPageResult> {
  console.log('[orchestrator] fetchNews input:', {
    query: input.query,
    category: input.category,
    startDate: input.startDate,
    endDate: input.endDate,
    page: input.page,
  })

  const mode = input.query?.trim() ? "search" : "headlines"

  if (input.query && input.query.length > 200) {
    throw new Error("Query must be under 200 characters")
  }

  const categories = Array.isArray(input.category)
    ? input.category
    : input.category
    ? [input.category]
    : []

  if (categories.some((category) => !(category in CATEGORY_MAP))) {
    throw new Error("Invalid category")
  }

  if (input.startDate && input.endDate) {
    const sDate = new Date(input.startDate)
    const eDate = new Date(input.endDate)

    console.log('[orchestrator] parsed dates:', { sDate: sDate.toISOString(), eDate: eDate.toISOString(), sTime: sDate.getTime(), eTime: eDate.getTime() })

    if (eDate <= sDate) {
      throw new Error("Invalid Date range: End date must be after start date")
    }

    if (eDate.getTime() - sDate.getTime() > 15 * 1000 * 60 * 60 * 24) {
      throw new Error("Invalid Date range: Date range must be within 15 days")
    }
  }

  assertProvidersConfigured()

  let pagination: PaginationState = {}
  let paginationReset = false

  // Try to decode the cursor; if expired, reset to page 1
  if (input.page) {
    try {
      pagination = decodePagination(input.page)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      if (errorMsg.includes("expired")) {
        console.log('[orchestrator] Page cursor expired, resetting pagination')
        paginationReset = true
        pagination = {} // Reset to page 1
      } else {
        throw error // Re-throw if it's a different error
      }
    }
  }

  const providers = getActiveProviders({ country: input.country, startDate: input.startDate, endDate: input.endDate })
  const isPaginated = Boolean(input.page) && !paginationReset

  const results = await Promise.all(
    providers.map(async (provider) => {
      const request: FetchRequest = {
        mode,
        query: input.query,
        category: input.category,
        country: input.country,
        startDate: input.startDate,
        endDate: input.endDate,
        cursor: isPaginated ? pickCursor(provider.id, pagination) : undefined,
      }

      try {
        const result = await provider.fetch(request)
        return { id: provider.id, ...result }
      } catch (error) {
        console.error(`[${provider.id}]`, error)
        return {
          id: provider.id,
          articles: [] as Article[],
          nextCursor: undefined,
        }
      }
    })
  )

  const byId = Object.fromEntries(results.map((result) => [result.id, result]))

  const aggregated = aggregateArticles(...results.map((result) => result.articles))

  const articles = aggregated.map((article) => ({
    ...article,
    category: normalizeArticleCategories(article.category),
  }))



  const nextState: PaginationState = {
    guardianPage: byId.guardian?.nextCursor as number | undefined,
    newsCursor: byId.newsdata?.nextCursor as string | undefined,
    currentNewsCursor: byId.currents?.nextCursor,
  }

  return {
    success: true,
    articles,
    nextPage: encodePagination(nextState),
  }
}
