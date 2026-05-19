import { NextRequest, NextResponse } from "next/server";
import { searchGuardianNews } from "@/lib/guardianNews";

export async function GET(request: NextRequest) {
    try{

        const searchParams = request.nextUrl.searchParams;

        const category = searchParams.get("category") || undefined;
        const query = searchParams.get("query") || undefined;

        let articles;

        articles = await searchGuardianNews(query, category);

        return NextResponse.json({success: true, articles});

    }catch(error){
        return NextResponse.json({success: false, error: (error as Error).message}, {status: 500});
    }
}