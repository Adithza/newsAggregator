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

        console.log(page);

        let guardianPage: number | undefined;
        let newsCursor: string | undefined;

        if(page){
            const decoded = decodeCursor(page);

            guardianPage = (decoded as any).guardianPage;
            newsCursor = (decoded as any).newsCursor;
        }

        console.log("Initial Guardian Page in news:", guardianPage);
        console.log("Initial NewsDataio Cursor in news:", newsCursor);


        if(category && !(category in CATEGORY_MAP)){
            return NextResponse.json({success: false, error: "Invalid category"}, {status: 400});
        }

        

        const guardianCat = category ? CATEGORY_MAP[category as Category].guardian : undefined;
        const newsDataioCat = category ? CATEGORY_MAP[category as Category].newsData : undefined;
        

        const [GuardianArticles, NewsDataioArticles] =
        await Promise.all([
            fetchGuardianHeadlines(guardianCat, page? guardianPage?.toString() : undefined),
            fetchNewsDataHeadlines(newsDataioCat, page? newsCursor : undefined),
        ]);

        const aggregatedArticles = aggregateArticles(GuardianArticles.articles, NewsDataioArticles.articles);

        const nextPageGuardian = GuardianArticles.nextPage;
        const nextPageNewsDataio = NewsDataioArticles.nextPage;

        console.log("Initial Guardian Page in news:", nextPageGuardian);
        console.log("Initial NewsDataio Cursor in news:", nextPageNewsDataio);

        const nextState = {
            guardianPage: nextPageGuardian,
            newsCursor: nextPageNewsDataio
        };


        return NextResponse.json({success: true, articles: aggregatedArticles,  nextPage: encodeCursor(nextState)});

    }catch(error){
        return NextResponse.json({success: false, error: (error as Error).message}, {status: 500});
    }
}