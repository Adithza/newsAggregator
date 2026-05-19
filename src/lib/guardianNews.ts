export async function fetchGuardianHeadlines(category?: string) {

    const params = new URLSearchParams();

    if(category){
        params.append("section", category)
    }   

    const res = await fetch(
        'https://content.guardianapis.com/search?'+ params.toString()+'&api-key=' + process.env.GUARDIANAPI_KEY,
        {next: { revalidate: 60 }}
    );
    const data = await res.json();
    return data;
}

export async function searchGuardianNews(query?: string, category?: string) {
    const params = new URLSearchParams();
    if(query){
        params.append("q", query)
    }

    if(category){
        params.append("section", category)
    }

    const res = await fetch(
        'https://content.guardianapis.com/search?'+ params.toString()+'&api-key=' + process.env.GUARDIANAPI_KEY,
        {next: { revalidate: 60 }}
    );
    const data = await res.json();
    return data;
}