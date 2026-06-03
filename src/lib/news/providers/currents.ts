import { CATEGORY_MAP } from "@/lib/category_map"
import { normalizeCurrentNewsArticle } from "@/lib/normalize"
import type { FetchRequest, ProviderResult } from "../types"
import type { NewsProvider } from "./types"
import { time } from "console"

export const currentsProvider: NewsProvider = {
  id: "currents",
  supportsCountryFilter: true,
  supportsDateFilter: true,

  isEnabled() {
    return Boolean(process.env.CURRENTNEWS_API_KEY)
  },

  resolveCategory(appCategory: string) {
    return CATEGORY_MAP[appCategory as keyof typeof CATEGORY_MAP]?.currentNews
  },

  async fetch(request: FetchRequest): Promise<ProviderResult> {
    const params = new URLSearchParams()

    if (request.mode === "search" && request.query) {
      params.append("keywords", request.query)
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

    console.log(request.mode)

    if (request.startDate && request.endDate) {
      params.append("start_date", new Date(request.startDate).toISOString())
      params.append("end_date", new Date(request.endDate).toISOString())
      console.log(params.toString())
      request.mode = "search"
    }

    console.log(request.mode)

    if (request.cursor != null) {
      params.append("page_number", String(request.cursor))
    }

    if (request.country) {
      params.append("country", request.country)
    }

    params.append("language", "en")
    params.append("page_size", "10")

    console.log(params.toString())

    const endpoint =
      request.mode === "search"
        ? "https://api.currentsapi.services/v2/search"
        : "https://api.currentsapi.services/v2/latest-news"

    console.log("Fetching from Currents API:", `${endpoint}?${params.toString()}`)

    const res = await fetch(
      `${endpoint}?apiKey=${process.env.CURRENTNEWS_API_KEY}&${params.toString()}`,
      { next: { revalidate: 300 } }
    )

    if (!res.ok) {
      throw new Error(
        `CurrentNews request failed: ${res.status} ${res.statusText}`
      )
    }

    const data = await res.json()

    return {
      articles: data.news.map((article: unknown) =>
        normalizeCurrentNewsArticle(article, request.country)
      ),
      nextCursor: data.page + 1,
    }
  },
}
