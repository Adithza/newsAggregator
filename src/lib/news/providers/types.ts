import type { FetchRequest, ProviderResult } from "../types"

export type ProviderId = "guardian" | "newsdata" | "currents"

export interface NewsProvider {
  id: ProviderId
  supportsCountryFilter: boolean
  supportsTimeframeFilter?: boolean
  isEnabled(request?: FetchRequest): boolean
  resolveCategory(appCategory: string): string | undefined
  fetch(request: FetchRequest): Promise<ProviderResult>
}
