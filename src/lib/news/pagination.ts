import type { PaginationState } from "./types"

export function encodePagination(state: PaginationState): string {
  const stateWithTimestamp = {
    ...state,
    timestamp: Date.now(),
  }
  return Buffer.from(JSON.stringify(stateWithTimestamp)).toString("base64")
}

export function decodePagination(page?: string, maxAgeMs = 5 * 60 * 1000): PaginationState {
  if (!page) return {}

  try {
    const decoded = JSON.parse(Buffer.from(page, "base64").toString("utf-8"))

    // Check if cursor has expired
    if (decoded.timestamp && Date.now() - decoded.timestamp > maxAgeMs) {
      throw new Error(
        `Page cursor expired: ${Math.round((Date.now() - decoded.timestamp) / 1000)}s old`
      )
    }

    return {
      guardianPage:
        decoded.guardianPage != null ? Number(decoded.guardianPage) : undefined,
      newsCursor:
        typeof decoded.newsCursor === "string" ? decoded.newsCursor : undefined,
      currentNewsCursor:
        decoded.currentNewsCursor != null
          ? decoded.currentNewsCursor
          : undefined,
    }
  } catch (err) {
    throw new Error(
      `Invalid page cursor: ${err instanceof Error ? err.message : String(err)}`
    )
  }
}
