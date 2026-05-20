import { normalize } from "path";
import { normalizeGuardianArticle } from "./normalize";

export async function fetchGuardianHeadlines(category?: string, page? : number) {

    const params = new URLSearchParams();

    if(category){
        params.append("section", category)
    }
    
    if(page){
        params.append("page", page.toString())
    }

    params.append("show-fields", "all");
    params.append("show-blocks", "body")

    const res = await fetch(
        'https://content.guardianapis.com/search?'+ params.toString()+'&api-key=' + process.env.GUARDIANAPI_KEY,
        {next: { revalidate: 300 }}
    );
    const data = await res.json();

    const normalized = await data.response.results.map(normalizeGuardianArticle);

    return normalized;
}

export async function searchGuardianNews(query?: string, category?: string, page? : number) {
    const params = new URLSearchParams();
    if(query){
        params.append("q", query)
    }

    if(category){
        params.append("section", category)
    }

    if(page){
        params.append("page", page.toString())
    }

    params.append("show-fields", "all");
    params.append("show-blocks", "body")


    const res = await fetch(
        'https://content.guardianapis.com/search?'+ params.toString()+'&api-key=' + process.env.GUARDIANAPI_KEY,
        {next: { revalidate: 300 }}
    );
    const data = await res.json();

    const normalized = await data.response.results.map(normalizeGuardianArticle);
    
    return normalized;
}