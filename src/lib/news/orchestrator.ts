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
  const mode = input.query?.trim() ? "search" : "headlines"

  if (input.category && !(input.category in CATEGORY_MAP)) {
    throw new Error("Invalid category")
  }

  assertProvidersConfigured()

  const pagination = decodePagination(input.page)
  const providers = getActiveProviders({ country: input.country })
  const isPaginated = Boolean(input.page)

  const results = await Promise.all(
    providers.map(async (provider) => {
      const request: FetchRequest = {
        mode,
        query: input.query,
        category: input.category,
        country: input.country,
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

  const aggregated = aggregateArticles(
    byId.guardian?.articles ?? [],
    byId.newsdata?.articles ?? [],
    byId.currents?.articles ?? []
  )

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
