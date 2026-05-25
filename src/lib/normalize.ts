import { CATEGORY_MAP } from "./category_map";
import { API_TO_CATEGORY_MAP } from "./reverseCatMap";

type Category = keyof typeof CATEGORY_MAP

export function normalizeGuardianArticle(article: any) {
    return {
        title: article.webTitle,
        url: article.webUrl,
        category: [article.sectionName],
        source : "Guardian",
        publishedAt: article.webPublicationDate,
        content: article.fields.bodyText,
        byline: (article.fields.byline ? article.fields.byline : undefined),
        thumbnail: (article.fields.thumbnail ? article.fields.thumbnail : "/image.png"),
    }
}

export function normalizeNewsDataioArticle(article: any) {
    return {
        title: article.title,
        url: article.link,
        category: article.category,
        source : article.source_name,
        publishedAt: new Date(article.pubDate + " UTC").toISOString(),
        content: article.description,
        byline: (article.creator ? article.creator.join(", ") : undefined),
        thumbnail: (article.image_url ? article.image_url : "/image.png"),
    }
}

export function normalizeCurrentNewsArticle(article: any) {
    return {
        title: article.title,
        url: article.url,
        category: article.category,
        source : "CurrentNews",
        publishedAt: new Date(article.published),
        content: article.description,
        byline: (article.author ? article.author: undefined),
        thumbnail: (article.image ? article.image : "/image.png")
    }
}

export function normalizeCategories(input: string[] = []): string[] {
  return input
    .map(c => API_TO_CATEGORY_MAP[c.toLowerCase()])
    .filter((c): c is Category => Boolean(c));
}