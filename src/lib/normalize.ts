import { CATEGORY_MAP } from "./category_map";
import { API_TO_CATEGORY_MAP } from "./reverseCatMap";

type Category = keyof typeof CATEGORY_MAP

const PLACEHOLDER_IMAGE = "/image.png";

export function resolveThumbnail(url: unknown): string {
    if (typeof url !== "string") return PLACEHOLDER_IMAGE;

    const trimmed = url.trim();
    if (!trimmed || /^none$/i.test(trimmed) || /^null$/i.test(trimmed)) {
        return PLACEHOLDER_IMAGE;
    }

    if (trimmed.startsWith("//")) {
        return `https:${trimmed}`;
    }

    return trimmed;
}

export function formatArticleCountry(
    value: unknown,
    countryFilter?: string
): string | undefined {
    if (Array.isArray(value)) {
        const joined = value.filter(Boolean).join(", ");
        if (joined) return joined;
    } else if (typeof value === "string" && value.trim()) {
        return value.trim();
    }

    if (countryFilter?.trim()) {
        return countryFilter.trim().toUpperCase();
    }

    return undefined;
}

export function normalizeGuardianArticle(article: any) {
    return {
        title: article.webTitle,
        url: article.webUrl,
        category: [article.sectionName],
        source : "Guardian",
        publishedAt: article.webPublicationDate,
        content: article.fields?.body,
        byline: (article.fields?.byline ? article.fields.byline : undefined),
        thumbnail: resolveThumbnail(article.fields?.thumbnail),
        country: "United Kingdom",
    }
}

export function normalizeNewsDataioArticle(article: any, countryFilter?: string) {
    return {
        title: article.title,
        url: article.link,
        category: (article.category ? article.category : "general"),
        source : article.source_name,
        publishedAt: new Date(article.pubDate + " " + article.pubDateTZ).toISOString(),
        content: article.description,
        byline: (article.creator ? article.creator.join(", ") : undefined),
        thumbnail: resolveThumbnail(article.image_url),
        country: formatArticleCountry(article.country, countryFilter),
    }
}

export function normalizeCurrentNewsArticle(article: any, countryFilter?: string) {
    return {
        title: article.title,
        url: article.url,
        category: (article.category ? article.category : "general"),
        source : "CurrentNews",
        publishedAt: new Date(article.published).toISOString(),
        content: article.description,
        byline: (article.author ? article.author: undefined),
        thumbnail: resolveThumbnail(article.image),
        country: formatArticleCountry(article.country, countryFilter),
    }
}

export function normalizeCategories(input: string[] = []): string[] {
  return input
    .flatMap((c) => {
      const mapped = API_TO_CATEGORY_MAP[c.toLowerCase()];
      if (!mapped) return [];
      return Array.isArray(mapped) ? mapped : [mapped];
    })
    .filter((c): c is Category => Boolean(c));
}
