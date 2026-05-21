import { normalizeGuardianArticle } from "./normalize";

export async function fetchGuardianHeadlines(category?: string, page: string = "1") {

    const params = new URLSearchParams();

    if(category){
        params.append("section", category)
    }

    if(page){
        params.append("page", page)
    }
    

    params.append("show-fields", "all");
    params.append("show-blocks", "body")

    try {
        const res = await fetch(
            'https://content.guardianapis.com/search?'+ params.toString()+'&api-key=' + process.env.GUARDIANAPI_KEY,
            {next: { revalidate: 300 }}
        );
        if (!res.ok) {
            throw new Error(`Guardian headlines request failed: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();

        const normalized = await data.response.results.map(normalizeGuardianArticle);

        return {
            articles: normalized,
            nextPage: data.response.currentPage + 1
        };
    } catch (error) {
        throw new Error(`Guardian headlines fetch error: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function searchGuardianNews(query?: string, category?: string, page: string = "1") {
    const params = new URLSearchParams();
    if(query){
        params.append("q", query)
    }

    if(category){
        params.append("section", category)
    }

    params.append("show-fields", "all");
    params.append("show-blocks", "body")

    if(page){
        params.append("page", page)
    }

    try {
        const res = await fetch(
            'https://content.guardianapis.com/search?'+ params.toString()+'&api-key=' + process.env.GUARDIANAPI_KEY,
            {next: { revalidate: 300 }}
        );
        if (!res.ok) {
            throw new Error(`Guardian search request failed: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();

        const normalized = await data.response.results.map(normalizeGuardianArticle);
        
        return {
            articles: normalized,
            nextPage: data.response.currentPage + 1
        };
    } catch (error) {
        throw new Error(`Guardian search fetch error: ${error instanceof Error ? error.message : String(error)}`);
    }
}