import { fetchNews } from "./news/orchestrator";

export async function getNews(category?: string | string[], page?: string, country?: string) {
    return fetchNews({ category, page, country });
}
