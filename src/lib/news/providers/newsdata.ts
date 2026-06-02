import { CATEGORY_MAP } from "@/lib/category_map"
import { normalizeNewsDataioArticle } from "@/lib/normalize"
import type { FetchRequest, ProviderResult } from "../types"
import type { NewsProvider } from "./types"

export const newsdataProvider: NewsProvider = {
  id: "newsdata",
  supportsCountryFilter: true,

  isEnabled() {
    return Boolean(process.env.NEWSDATA_API_KEY)
  },

  resolveCategory(appCategory: string) {
    return CATEGORY_MAP[appCategory as keyof typeof CATEGORY_MAP]?.newsData
  },

  async fetch(request: FetchRequest): Promise<ProviderResult> {
    const params = new URLSearchParams()

    if (request.mode === "search" && request.query) {
      params.append("q", request.query)
    }

    if (request.category) {
      const requestedCategories = Array.isArray(request.category)
        ? request.category
        : [request.category]

      requestedCategories.forEach((category) => {
        const apiCategory = this.resolveCategory(category)
        if (apiCategory) params.append("category", apiCategory)
      })
    }

    if (request.cursor != null) {
      params.append("page", String(request.cursor))
    }

    if (request.country) {
      params.append("country", request.country)
    }

    params.append("language", "en")
    params.append("removeduplicate", "1")

    const res = await fetch(
      `https://newsdata.io/api/1/latest?apikey=${process.env.NEWSDATA_API_KEY}&${params.toString()}`,
      { next: { revalidate: 300 } }
    )

    if (!res.ok) {
      throw new Error(
        `NewsData.io request failed: ${res.status} ${res.statusText}`
      )
    }

    const data = await res.json()

    return {
      articles: data.results.map((article: unknown) =>
        normalizeNewsDataioArticle(article, request.country)
      ),
      nextCursor: data.nextPage,
    }
  },
}
