import { NextRequest, NextResponse } from "next/server";
import { searchGuardianNews } from "@/lib/guardianNews";
import { searchNewsDataio } from "@/lib/newsDataio";
import { aggregateArticles } from "@/lib/aggregate";
import { CATEGORY_MAP } from "@/lib/category_map";
import { decodeCursor, encodeCursor } from "@/lib/cursorEncoder";
import { searchNews } from "@/lib/searchNews";

export async function GET(request: NextRequest) {
    try{
        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get("category") || undefined;
        const page = searchParams.get("page") || undefined;
        const query = searchParams.get("query") || undefined;

        const result = await searchNews(category, page, query);
        return NextResponse.json(result);

    }catch(error){
        return NextResponse.json({success: false, error: (error as Error).message}, {status: 500});
    }
}