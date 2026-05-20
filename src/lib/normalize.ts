export function normalizeGuardianArticle(article: any) {


    return {
        title: article.webTitle,
        url: article.webUrl,
        category: [article.sectionName],
        source : "Guardian",
        publishedAt: article.webPublicationDate,
        content: article.fields.bodyText,
        byline: (article.fields.byline ? article.fields.byline : undefined),
        thumbnail: (article.fields.thumbnail ? article.fields.thumbnail : undefined)
    }
}

export function normalizeNewsDataioArticle(article: any) {
    return {
        title: article.title,
        url: article.link,
        category: article.category,
        source : article.source_name,
        publishedAt: article.pubDate,
        content: article.description,
        byline: (article.creator ? article.creator.join(", ") : undefined),
        thumbnail: (article.image_url ? article.image_url : undefined)
    }
}