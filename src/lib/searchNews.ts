import { fetchNews } from "./news/orchestrator";

export async function searchNews(
    category?: string | string[],
    page?: string,
    query?: string,
    country?: string,
    startDate?: string,
    endDate?: string
) {
    return fetchNews({ category, page, query, country, startDate, endDate });
}
