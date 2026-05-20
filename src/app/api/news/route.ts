import { NextRequest, NextResponse } from "next/server";
import { fetchGuardianHeadlines} from "@/lib/guardianNews";
import { fetchNewsDataHeadlines } from "@/lib/newsDataio";
import { aggregateArticles } from "@/lib/aggregate";
import { CATEGORY_MAP } from "@/lib/category_map";

export async function GET(request: NextRequest) {
    try{

        const searchParams = request.nextUrl.searchParams;

        const category = searchParams.get("category") || "sports";
        const pagePara = searchParams.get("page") || undefined;
        const page = pagePara ? parseInt(pagePara) : undefined;

        const guardianCat = CATEGORY_MAP[category].guardian;

        const [GuardianArticles, NewsDataioArticles] =
        await Promise.all([
            fetchGuardianHeadlines(category, page),
            fetchNewsDataHeadlines(category),
        ]);

        const aggregatedArticles = aggregateArticles(GuardianArticles, NewsDataioArticles);

        return NextResponse.json({success: true, articles: aggregatedArticles});

    }catch(error){
        return NextResponse.json({success: false, error: (error as Error).message}, {status: 500});
    }
}