import { NextRequest, NextResponse } from "next/server";
import { searchNews } from "@/lib/searchNews";
import { searchRatelimit } from "@/lib/rateLimit";

export async function GET(request: NextRequest) {
    try{

        const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1";
        
        const {success} = await searchRatelimit.limit(ip);
        
        if(!success){
            console.log(`Rate limit exceeded for IP: ${ip}`);
            return NextResponse.json({success: false, error: 'Rate limit exceeded. Try again later.'});
        }

        const searchParams = request.nextUrl.searchParams;
        const categories = searchParams.getAll("category")
        const category = categories.length ? categories : undefined
        const page = searchParams.get("page") || undefined;
        const query = searchParams.get("query") || undefined;
        const country = searchParams.get("country") || undefined;
        const startDate = searchParams.get("startDate") || undefined;
        const endDate = searchParams.get("endDate") || undefined;

        const result = await searchNews(category, page, query, country, startDate, endDate);
        return NextResponse.json(result);

    }catch(error){
        return NextResponse.json({success: false, error: (error as Error).message}, {status: 500});
    }
}
