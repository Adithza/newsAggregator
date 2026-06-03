import { fetchNews } from "./news/orchestrator";

export async function getNews(
    category?: string | string[],
    page?: string,
    country?: string,
    startDate?: string,
    endDate?: string
) {
    return fetchNews({ category, page, country, startDate, endDate });
}
