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

        if(page){
                    const decoded = decodeCursor(page);
        
                    if(decoded && typeof decoded === "object"){
                        const guardianPage = (decoded as any).guardianPage;
                        const newsCursor = (decoded as any).newsCursor;
                    }
                }
        
        const guardianCat = category ? CATEGORY_MAP[category as Category].guardian : undefined;
        const newsDataioCat = category ? CATEGORY_MAP[category as Category].newsData : undefined;
                
        
        const [GuardianArticles, NewsDataioArticles] =
        await Promise.all([
            searchGuardianNews(query, guardianCat),
            searchNewsDataio(query, newsDataioCat),
        ]);

        const nextPageGuardian = GuardianArticles.nextPage;
        const nextPageNewsDataio = NewsDataioArticles.nextPage;

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