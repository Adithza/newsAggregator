import type { FetchRequest, ProviderResult } from "../types"
import type { NewsProvider } from "./types"

export const mockProvider: NewsProvider = {
  id: "mock",
  supportsCountryFilter: false,
  supportsDateFilter: false,
  isEnabled() {
    return process.env.TEST_MODE === "true"
  },
  resolveCategory() {
    return undefined
  },
  async fetch(request: FetchRequest): Promise<ProviderResult> {
    const publishedAt = new Date().toISOString()
    const category = Array.isArray(request.category)
      ? request.category
      : request.category
      ? [request.category]
      : ["general"]

    return {
      articles: [
        {
          title: "Mock article from test mode",
          url: `https://example.com/mock-article?query=${encodeURIComponent(
            request.query ?? ""
          )}`,
          source: "mock",
          publishedAt,
          content: request.query
            ? `Mock search result for ${request.query}`
            : "Mock headlines content",
          thumbnail: "https://example.com/mock-thumbnail.jpg",
          category,
        },
      ],
      nextCursor: undefined,
    }
  },
}
