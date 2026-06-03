import { currentsProvider } from "./providers/currents"
import { guardianProvider } from "./providers/guardian"
import { newsdataProvider } from "./providers/newsdata"
import type { NewsProvider } from "./providers/types"

export const newsProviders: NewsProvider[] = [
  guardianProvider,
  newsdataProvider,
  currentsProvider,
]

export function assertProvidersConfigured(): void {
  const missingKeys: string[] = []
  if (!process.env.GUARDIANAPI_KEY) missingKeys.push("GUARDIANAPI_KEY")
  if (!process.env.NEWSDATA_API_KEY) missingKeys.push("NEWSDATA_API_KEY")
  if (!process.env.CURRENTNEWS_API_KEY) missingKeys.push("CURRENTNEWS_API_KEY")
  if (missingKeys.length) {
    throw new Error(`Missing env vars: ${missingKeys.join(", ")}`)
  }
}

export function getActiveProviders(opts: {
  country?: string,
  startDate?: string
  endDate?: string
}): NewsProvider[] {
  return newsProviders.filter((provider) => {
    if (!provider.isEnabled()) return false
    if (opts.country && !provider.supportsCountryFilter) return false
    if (opts.startDate && opts.endDate && !provider.supportsDateFilter) return false

    return true
  })
}
