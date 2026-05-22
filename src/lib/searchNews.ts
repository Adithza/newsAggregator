import { aggregateArticles } from "./aggregate";
import { CATEGORY_MAP } from "./category_map";
import { decodeCursor, encodeCursor } from "./cursorEncoder";
import { fetchGuardianHeadlines, searchGuardianNews } from "./guardianNews";
import { fetchNewsDataHeadlines, searchNewsDataio } from "./newsDataio";

type Category = keyof typeof CATEGORY_MAP;


export async function searchNews(category?: string, page?: string, query?: string) {
    let guardianPage: number | undefined;
    let newsCursor: string | undefined;

    if (page) {
        try {
            const decoded = decodeCursor(page);
            if (!decoded || typeof decoded !== 'object') throw new Error('Invalid cursor');

            const possibleGuardian = (decoded as any).guardianPage;
            const possibleNewsCursor = (decoded as any).newsCursor;

            guardianPage = (possibleGuardian !== undefined && possibleGuardian !== null) ? Number(possibleGuardian) : undefined;
            newsCursor = (typeof possibleNewsCursor === 'string') ? possibleNewsCursor : undefined;
        } catch (err) {
            throw new Error('Invalid page cursor');
        }
    }

    console.log("Initial Guardian Page in news:", guardianPage);
    console.log("Initial NewsDataio Cursor in news:", newsCursor);

    if (category && !(category in CATEGORY_MAP)) {
        throw new Error("Invalid category");
    }

    const missingKeys: string[] = [];
    if (!process.env.GUARDIANAPI_KEY) missingKeys.push('GUARDIANAPI_KEY');
    if (!process.env.NEWSDATA_API_KEY) missingKeys.push('NEWSDATA_API_KEY');
    if (missingKeys.length) {
        throw new Error(`Missing env vars: ${missingKeys.join(', ')}`);
    }

    const guardianCat = category ? CATEGORY_MAP[category as Category].guardian : undefined;
    const newsDataioCat = category ? CATEGORY_MAP[category as Category].newsData : undefined;
    
    let GuardianArticles = { articles: [], nextPage: undefined };
    let NewsDataioArticles = { articles: [], nextPage: undefined };

    try {
        GuardianArticles = await searchGuardianNews(query, guardianCat, page ? guardianPage?.toString() : undefined);
    } catch (error) {
        console.error(error);
    }

    try {
        NewsDataioArticles = await searchNewsDataio(query, newsDataioCat, page ? newsCursor : undefined);
    } catch (error) {
        console.error(error);
    }

    const aggregatedArticles = aggregateArticles(GuardianArticles.articles, NewsDataioArticles.articles);

    const nextPageGuardian = GuardianArticles.nextPage;
    const nextPageNewsDataio = NewsDataioArticles.nextPage;

    console.log("Final Guardian Page in news:", nextPageGuardian);
    console.log("Final NewsDataio Cursor in news:", nextPageNewsDataio);

    const nextState = {
        guardianPage: nextPageGuardian,
        newsCursor: nextPageNewsDataio
    };

    return {
        success: true,
        articles: aggregatedArticles,
        nextPage: encodeCursor(nextState)
    };
}
