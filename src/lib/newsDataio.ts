import { normalizeNewsDataioArticle } from "./normalize";

export async function fetchNewsDataHeadlines(category?: string) {
    const params = new URLSearchParams();

    if(category){
        params.append("category", category)
    }
    
    params.append("language", "en");

    const res = await fetch("https://newsdata.io/api/1/latest?apikey=" + process.env.NEWSDATA_API_KEY + "&" + params.toString(), {next: { revalidate: 300 }});
    const data = await res.json();

    const normalized = await data.results.map(normalizeNewsDataioArticle)

    return normalized;
}

export async function searchNewsDataio(query?: string, category?: string) {
    const params = new URLSearchParams();

    if(query){
        params.append("q", query)
    }

    if(category){
        params.append("category", category)
    }

    params.append("language", "en");
    params.append("removeduplicate", "1");

    const res = await fetch("https://newsdata.io/api/1/latest?apikey=" + process.env.NEWSDATA_API_KEY + "&" + params.toString(), {next: { revalidate: 300 }});
    const data = await res.json();

    const normalized = await data.results.map(normalizeNewsDataioArticle)

    return normalized;
}