import { normalizeCurrentNewsArticle } from "./normalize";

export async function fetchCurrentNewsHeadlines(category?: string, page?: string, country?: string) {
    const params = new URLSearchParams();

    if(category){
        params.append("category", category)
    }

    if(page){
        params.append("page_number", page)
    }

    if(country){
        params.append("country", country)
    }
    
    params.append("language", "en");
    params.append("page_size", "10");

    try {
        const res = await fetch("https://api.currentsapi.services/v2/latest-news?apiKey=" + process.env.CURRENTNEWS_API_KEY + "&" + params.toString(), {next: { revalidate: 300 }});
        if (!res.ok) {
            throw new Error(`CurrentNews headlines request failed: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();

        console.log(country)
        console.log(data)

        const normalized = data.news.map(normalizeCurrentNewsArticle)

        return {
            articles: normalized,
            nextPage: data.page + 1
        };
    } catch (error) {
        throw new Error(`currentNews headlines fetch error: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function searchCurrentNews(query?: string, category?: string, page?: string, country?: string) {
    const params = new URLSearchParams();

    if(query){
        params.append("keywords", query)
    }

    if(category){
        params.append("category", category)
    }

     if(page){
        params.append("page_number", page)
    }

    if(country){
        params.append("country", country)
    }
    
    params.append("language", "en");
    params.append("page_size", "10");;

    try {
        const res = await fetch("https://api.currentsapi.services/v2/search?apiKey=" + process.env.CURRENTNEWS_API_KEY + "&" + params.toString(), {next: { revalidate: 300 }});
        if (!res.ok) {
            throw new Error(`CurrentNews search request failed: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();

        const normalized = data.news.map(normalizeCurrentNewsArticle)

        return {
            articles: normalized,
            nextPage: data.page + 1
        };
    } catch (error) {
        throw new Error(`CurrentNews search fetch error: ${error instanceof Error ? error.message : String(error)}`);
    }
}