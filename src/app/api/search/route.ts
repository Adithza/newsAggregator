import { NextRequest, NextResponse } from "next/server";
import { searchGuardianNews } from "@/lib/guardianNews";
import { searchNewsDataio } from "@/lib/newsDataio";
import { aggregateArticles } from "@/lib/aggregate";
import { CATEGORY_MAP } from "@/lib/category_map";

export async function GET(request: NextRequest) {
    try{

        type Category = keyof typeof CATEGORY_MAP;

        const searchParams = request.nextUrl.searchParams;

        const category = searchParams.get("category") || undefined;
        const query = searchParams.get("query") || undefined;

        if(category && !(category in CATEGORY_MAP)){
            return NextResponse.json({success: false, error: "Invalid category"}, {status: 400});
        }
        
        const guardianCat = category ? CATEGORY_MAP[category as Category].guardian : undefined;
        const newsDataioCat = category ? CATEGORY_MAP[category as Category].newsData : undefined;
                
        
        const [GuardianArticles, NewsDataioArticles] =
        await Promise.all([
            searchGuardianNews(query, guardianCat),
            searchNewsDataio(query, newsDataioCat),
        ]);
        
        const aggregatedArticles = aggregateArticles(GuardianArticles, NewsDataioArticles);
       

        return NextResponse.json({success: true, articles: aggregatedArticles});

    }catch(error){
        return NextResponse.json({success: false, error: (error as Error).message}, {status: 500});
    }
}