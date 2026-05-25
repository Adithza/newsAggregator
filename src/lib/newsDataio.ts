import { normalizeNewsDataioArticle } from "./normalize";

export async function fetchNewsDataHeadlines(category?: string, page?: string) {
    const params = new URLSearchParams();

    if(category){
        params.append("category", category)
    }

    if(page){
        params.append("page", page)
    }
    
    params.append("language", "en");
    params.append("removeduplicate", "1");


    try {
        const res = await fetch("https://newsdata.io/api/1/latest?apikey=" + process.env.NEWSDATA_API_KEY + "&" + params.toString(), {next: { revalidate: 300 }});
        if (!res.ok) {
            throw new Error(`NewsData.io headlines request failed: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();

        const normalized = data.results.map(normalizeNewsDataioArticle)

        return {
            articles: normalized,
            nextPage: data.nextPage
        };
    } catch (error) {
        throw new Error(`NewsData.io headlines fetch error: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function searchNewsDataio(query?: string, category?: string, page?: string) {
    const params = new URLSearchParams();

    if(query){
        params.append("q", query)
    }

    if(category){
        params.append("category", category)
    }

    if(page){
        params.append("page", page)
    }

    params.append("language", "en");
    params.append("removeduplicate", "1");

    try {
        const res = await fetch("https://newsdata.io/api/1/latest?apikey=" + process.env.NEWSDATA_API_KEY + "&" + params.toString(), {next: { revalidate: 300 }});
        if (!res.ok) {
            throw new Error(`NewsData.io search request failed: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();

        const normalized = data.results.map(normalizeNewsDataioArticle)

        return {
            articles: normalized,
            nextPage: data.nextPage
        };
    } catch (error) {
        throw new Error(`NewsData.io search fetch error: ${error instanceof Error ? error.message : String(error)}`);
    }
}