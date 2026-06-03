import { fetchNews } from "./news/orchestrator";

export async function searchNews(
    category?: string | string[],
    page?: string,
    query?: string,
    country?: string,
    timeframe?: string
) {
    return fetchNews({ category, page, query, country, timeframe });
}
