import { NextRequest, NextResponse } from "next/server";
import { fetchGuardianHeadlines} from "@/lib/guardianNews";
import { fetchNewsDataHeadlines } from "@/lib/newsDataio";
import { aggregateArticles } from "@/lib/aggregate";
import { CATEGORY_MAP } from "@/lib/category_map";
import { decodeCursor, encodeCursor } from "@/lib/cursorEncoder";

export async function GET(request: NextRequest) {
    try{

        type Category = keyof typeof CATEGORY_MAP;

        const searchParams = request.nextUrl.searchParams;

        const category = searchParams.get("category") || undefined;
       
        const page = searchParams.get("page") || undefined;

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
                return NextResponse.json({ success: false, error: 'Invalid page cursor' }, { status: 400 });
            }
        }

        console.log("Initial Guardian Page in news:", guardianPage);
        console.log("Initial NewsDataio Cursor in news:", newsCursor);

        if (category && !(category in CATEGORY_MAP)) {
            return NextResponse.json({ success: false, error: "Invalid category" }, { status: 400 });
        }

        const missingKeys: string[] = [];
        if (!process.env.GUARDIANAPI_KEY) missingKeys.push('GUARDIANAPI_KEY');
        if (!process.env.NEWSDATA_API_KEY) missingKeys.push('NEWSDATA_API_KEY');
        if (missingKeys.length) {
            return NextResponse.json({ success: false, error: `Missing env vars: ${missingKeys.join(', ')}` }, { status: 500 });
        }

        

        const guardianCat = category ? CATEGORY_MAP[category as Category].guardian : undefined;
        const newsDataioCat = category ? CATEGORY_MAP[category as Category].newsData : undefined;
        
        let GuardianArticles = { articles: [], nextPage: undefined };
        let NewsDataioArticles = { articles: [], nextPage: undefined };

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

        const aggregatedArticles = aggregateArticles(GuardianArticles.articles, NewsDataioArticles.articles);

        const nextPageGuardian = GuardianArticles.nextPage;
        const nextPageNewsDataio = NewsDataioArticles.nextPage;

        console.log("Final Guardian Page in news:", nextPageGuardian);
        console.log("Final NewsDataio Cursor in news:", nextPageNewsDataio);

        const nextState = {
            guardianPage: nextPageGuardian,
            newsCursor: nextPageNewsDataio
        };


        return NextResponse.json({success: true, articles: aggregatedArticles,  nextPage: encodeCursor(nextState)});

    }catch(error){
        return NextResponse.json({success: false, error: (error as Error).message}, {status: 500});
    }
}