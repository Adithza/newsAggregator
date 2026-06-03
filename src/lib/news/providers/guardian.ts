import { CATEGORY_MAP } from "@/lib/category_map"
import { normalizeGuardianArticle } from "@/lib/normalize"
import type { FetchRequest, ProviderResult } from "../types"
import type { NewsProvider } from "./types"

export const guardianProvider: NewsProvider = {
  id: "guardian",
  supportsCountryFilter: false,
  supportsTimeframeFilter: false,
  isEnabled() {
    return Boolean(process.env.GUARDIANAPI_KEY)
  },

  resolveCategory(appCategory: string) {
    return CATEGORY_MAP[appCategory as keyof typeof CATEGORY_MAP]?.guardian
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
        if (apiCategory) params.append("section", apiCategory)
      })
    }

    if (request.timeframe) {
      params.append("to-date", new Date().toISOString().split("T")[0])
      params.append(
        "from-date",
        new Date(Date.now() - parseInt(request.timeframe) * 60 * 60 * 1000).toISOString().split("T")[0]
      )
      console.log("Timeframe params:", {
        "from-date": new Date(Date.now() - parseInt(request.timeframe) * 60 * 60 * 1000).toISOString().split("T")[0],
        "to-date": new Date().toISOString().split("T")[0],
      })
    }

    if (request.cursor != null) {
      params.append("page", String(request.cursor))
    }

    params.append("show-fields", "all")
    params.append("show-blocks", "body")

    const res = await fetch(
      `https://content.guardianapis.com/search?${params.toString()}&api-key=${process.env.GUARDIANAPI_KEY}`,
      { next: { revalidate: 300 } }
    )

    if (!res.ok) {
      throw new Error(
        `Guardian request failed: ${res.status} ${res.statusText}`
      )
    }

    const data = await res.json()

    return {
      articles: data.response.results.map(normalizeGuardianArticle),
      nextCursor: data.response.currentPage + 1,
    }
  },
}
