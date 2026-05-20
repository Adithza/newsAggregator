import { NextRequest, NextResponse } from "next/server";
import { searchGuardianNews } from "@/lib/guardianNews";
import { searchNewsDataio } from "@/lib/newsDataio";
import { aggregateArticles } from "@/lib/aggregate";

export async function GET(request: NextRequest) {
    try{

        const searchParams = request.nextUrl.searchParams;

        const category = searchParams.get("category") || undefined;
        const query = searchParams.get("query") || undefined;

         let GuardianArticles, NewsDataioArticles;
               
        GuardianArticles = await searchGuardianNews(query, category);
        
        NewsDataioArticles = await searchNewsDataio(query, category);
        
        let aggregatedArticles = aggregateArticles(GuardianArticles, NewsDataioArticles);

        return NextResponse.json({success: true, articles: aggregatedArticles});

    }catch(error){
        return NextResponse.json({success: false, error: (error as Error).message}, {status: 500});
    }
}