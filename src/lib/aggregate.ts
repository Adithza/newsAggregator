export function aggregateArticles(...articleLists: any[][]) {
    const allArticles = articleLists.flat();

    allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const seen = new Set<string>();
    return allArticles.filter(article => {
        if (!article.url) return false;
        if (seen.has(article.url)) return false;
        seen.add(article.url);
        return true;
    });
}