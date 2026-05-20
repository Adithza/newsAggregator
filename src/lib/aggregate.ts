export function aggregateArticles(guardianArticles: any[], newsDataioArticles: any[]) {
    const allArticles = [...guardianArticles, ...newsDataioArticles];

    allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return allArticles;
}