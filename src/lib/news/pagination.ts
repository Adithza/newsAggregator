import type { PaginationState } from "./types"

export function encodePagination(state: PaginationState): string {
  return Buffer.from(JSON.stringify(state)).toString("base64")
}

export function decodePagination(page?: string): PaginationState {
  if (!page) return {}

  try {
    const decoded = JSON.parse(Buffer.from(page, "base64").toString("utf-8"))

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
