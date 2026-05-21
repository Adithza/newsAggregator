import { NextRequest, NextResponse } from "next/server";
import { searchGuardianNews } from "@/lib/guardianNews";
import { searchNewsDataio } from "@/lib/newsDataio";
import { aggregateArticles } from "@/lib/aggregate";
import { CATEGORY_MAP } from "@/lib/category_map";
import { decodeCursor, encodeCursor } from "@/lib/cursorEncoder";

export async function GET(request: NextRequest) {
    try{

        type Category = keyof typeof CATEGORY_MAP;

        const searchParams = request.nextUrl.searchParams;

        const category = searchParams.get("category") || undefined;
        const query = searchParams.get("query") || undefined;
        const page = searchParams.get("page") || undefined;

        if(category && !(category in CATEGORY_MAP)){
            return NextResponse.json({success: false, error: "Invalid category"}, {status: 400});
        }

        let guardianPage: number | undefined;
        let newsCursor: string | undefined;

        if(page){
            const decoded = decodeCursor(page);

            guardianPage = (decoded as any).guardianPage;
            newsCursor = (decoded as any).newsCursor;
        }

        console.log("Initial Guardian Page:", guardianPage);
        console.log("Initial NewsDataio Cursor:", newsCursor);

        const guardianCat = category ? CATEGORY_MAP[category as Category].guardian : undefined;
        const newsDataioCat = category ? CATEGORY_MAP[category as Category].newsData : undefined;
                
        
        const [GuardianArticles, NewsDataioArticles] =
        await Promise.all([
            searchGuardianNews(query, guardianCat, page? guardianPage?.toString() : undefined),
            searchNewsDataio(query, newsDataioCat, page? newsCursor : undefined),
        ]);

        const nextPageGuardian = GuardianArticles.nextPage;
        const nextPageNewsDataio = NewsDataioArticles.nextPage;

        console.log("Final Guardian Page:", nextPageGuardian);
        console.log("Final NewsDataio Cursor:", nextPageNewsDataio);

        const nextState = {
            guardianPage: nextPageGuardian,
            newsCursor: nextPageNewsDataio
        };
        
        const aggregatedArticles = aggregateArticles(GuardianArticles.articles, NewsDataioArticles.articles);
       

        return NextResponse.json({success: true, articles: aggregatedArticles, nextPage: encodeCursor(nextState)});

    }catch(error){
        return NextResponse.json({success: false, error: (error as Error).message}, {status: 500});
    }
}