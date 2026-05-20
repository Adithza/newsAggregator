import { NextRequest, NextResponse } from "next/server";
import { fetchGuardianHeadlines} from "@/lib/guardianNews";
import { normalizeGuardianArticle } from "@/lib/normalize";
import { fetchNewsDataHeadlines } from "@/lib/newsDataio";

export async function GET(request: NextRequest) {
    try{

        const searchParams = request.nextUrl.searchParams;

        const category = searchParams.get("category") || undefined;
        const pagePara = searchParams.get("page") || undefined;
        const page = pagePara ? parseInt(pagePara) : undefined;

        let articles, testarticles;
       
        articles = await fetchGuardianHeadlines(category, page);

        testarticles = await fetchNewsDataHeadlines(category);

        console.log(testarticles);

        return NextResponse.json({success: true, articles});

    }catch(error){
        return NextResponse.json({success: false, error: (error as Error).message}, {status: 500});
    }
}