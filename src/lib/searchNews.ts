import { fetchNews } from "./news/orchestrator";

export async function searchNews(
    category?: string,
    page?: string,
    query?: string,
    country?: string
) {
    return fetchNews({ category, page, query, country });
}
