import { NextRequest, NextResponse } from "next/server";
import { searchNews } from "@/lib/searchNews";
import { newsRatelimit, searchRatelimit } from "@/lib/rateLimit";

export async function GET(request: NextRequest) {
    try{

        const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1";
        
        console.log("NODE_ENV:", process.env.NODE_ENV, "TEST_MODE:", process.env.TEST_MODE);

        const skipRateLimit =
            process.env.NODE_ENV === 'test' || process.env.TEST_MODE === 'true';

        if (!skipRateLimit) {
            const { success: searchSuccess } = await searchRatelimit.limit(ip);

            if (!searchSuccess) {
                console.log(`Rate limit exceeded for IP: ${ip}`);
                return NextResponse.json(
                    { success: false, error: "Rate limit exceeded. Try again later." },
                    { status: 429 }
                );
            }

            const { success: newsSuccess } = await newsRatelimit.limit(ip);

            if (!newsSuccess) {
                return NextResponse.json(
                    { success: false, error: "Rate limit exceeded. Try again later." },
                    { status: 429 }
                );
            }
        }

        const searchParams = request.nextUrl.searchParams;
        const categories = searchParams.getAll("category")
        const category = categories.length ? categories : undefined
        const page = searchParams.get("page") || undefined;
        const query = searchParams.get("query") || undefined;
        const country = searchParams.get("country") || undefined;
        const startDate = searchParams.get("startDate") || undefined;
        const endDate = searchParams.get("endDate") || undefined;

        console.log("categories at api: ", category)

        const result = await searchNews(category, page, query, country, startDate, endDate);
        return NextResponse.json(result);

    }catch(error){
        return NextResponse.json({success: false, error: (error as Error).message}, {status: 500});
    }
}
