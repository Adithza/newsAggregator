import type { FetchRequest, ProviderResult } from "../types"

export type ProviderId = "guardian" | "newsdata" | "currents"

export interface NewsProvider {
  id: ProviderId
  supportsCountryFilter: boolean
  isEnabled(): boolean
  resolveCategory(appCategory: string): string | undefined
  fetch(request: FetchRequest): Promise<ProviderResult>
}
