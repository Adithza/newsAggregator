import { aggregateArticles } from "./aggregate";
import { CATEGORY_MAP } from "./category_map";
import { fetchCurrentNewsHeadlines } from "./currentNews";
import { decodeCursor, encodeCursor } from "./cursorEncoder";
import { fetchGuardianHeadlines } from "./guardianNews";
import { fetchNewsDataHeadlines } from "./newsDataio";
import { normalizeCategories } from "./normalize";

type Category = keyof typeof CATEGORY_MAP;


export async function getNews(category?: string, page?: string) {
    let guardianPage: number | undefined;
    let newsCursor: string | undefined;
    let currentNewsCursor : string | undefined;

    if (page) {
        try {
            console.log("DEBUG: received page parameter =", JSON.stringify(page));
            const decodedString = Buffer.from(page, "base64").toString("utf-8");
            console.log("DEBUG: decodedString =", JSON.stringify(decodedString));
            const decoded = decodeCursor(page);
            if (!decoded || typeof decoded !== 'object') throw new Error('Invalid cursor');

            const possibleGuardian = (decoded as any).guardianPage;
            const possibleNewsCursor = (decoded as any).newsCursor;
            const possibleCurrentNewsCursor = (decoded as any).currentNewsCursor;

            guardianPage = (possibleGuardian !== undefined && possibleGuardian !== null) ? Number(possibleGuardian) : undefined;
            newsCursor = (typeof possibleNewsCursor === 'string') ? possibleNewsCursor : undefined;
            currentNewsCursor = (possibleCurrentNewsCursor !== undefined && possibleCurrentNewsCursor !== null) ? String(possibleCurrentNewsCursor) : undefined;
        } catch (err) {
            throw new Error(`Invalid page cursor: ${err instanceof Error ? err.message : String(err)}`);
        }
    }

    console.log("Initial Guardian Page in news:", guardianPage);
    console.log("Initial NewsDataio Cursor in news:", newsCursor);
    console.log("Initial CurrentNewsPage:", currentNewsCursor)

    if (category && !(category in CATEGORY_MAP)) {
        throw new Error("Invalid category");
    }

    const missingKeys: string[] = [];
    if (!process.env.GUARDIANAPI_KEY) missingKeys.push('GUARDIANAPI_KEY');
    if (!process.env.NEWSDATA_API_KEY) missingKeys.push('NEWSDATA_API_KEY');
    if (!process.env.CURRENTNEWS_API_KEY) missingKeys.push('CURRENTNEWS_API_KEY')
    if (missingKeys.length) {
        throw new Error(`Missing env vars: ${missingKeys.join(', ')}`);
    }

    const guardianCat = category ? CATEGORY_MAP[category as Category].guardian : undefined;
    const newsDataioCat = category ? CATEGORY_MAP[category as Category].newsData : undefined;
    const currentNewsCat = category ? CATEGORY_MAP[category as Category].currentNews : undefined
    
    let GuardianArticles = { articles: [], nextPage: undefined };
    let NewsDataioArticles = { articles: [], nextPage: undefined };
    let CurrentNewsArticles = {articles: [], nextPage: undefined };

    try {
        GuardianArticles = await fetchGuardianHeadlines(guardianCat, page ? guardianPage?.toString() : undefined);
    } catch (error) {
        console.error(error);
    }

    try {
        NewsDataioArticles = await fetchNewsDataHeadlines(newsDataioCat, page ? newsCursor : undefined);
    } catch (error) {
        console.error(error);
    }

    try {
        CurrentNewsArticles = await fetchCurrentNewsHeadlines(currentNewsCat, page ? currentNewsCursor : undefined)
    } catch(error){
        console.error(error)
    }

    const aggregatedArticles = aggregateArticles(GuardianArticles.articles, NewsDataioArticles.articles, CurrentNewsArticles.articles);

    const updatedArticles = aggregatedArticles.map(article => ({
        ...article,
        category: Array.isArray(article.category)
        ? normalizeCategories(article.category)
        : article.category
            ? normalizeCategories([article.category])
            : []
    }));

    const nextPageGuardian = GuardianArticles.nextPage;
    const nextPageNewsDataio = NewsDataioArticles.nextPage;
    const nextPageCurrentNews = CurrentNewsArticles.nextPage;

    console.log("Final Guardian Page in news:", nextPageGuardian);
    console.log("Final NewsDataio Cursor in news:", nextPageNewsDataio);
    console.log("Final CurrentNewsPage:", nextPageCurrentNews)

    const nextState = {
        guardianPage: nextPageGuardian,
        newsCursor: nextPageNewsDataio,
        currentNewsCursor: nextPageCurrentNews
    };

    return {
        success: true,
        articles: updatedArticles,
        nextPage: encodeCursor(nextState)
    };
}
