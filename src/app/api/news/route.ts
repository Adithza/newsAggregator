import { NextRequest, NextResponse } from "next/server";
import { getNews } from "@/lib/getNews";
import { newsRatelimit } from "@/lib/rateLimit";

export async function GET(request: NextRequest) {
    try {

        const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1";

        const {success} = await newsRatelimit.limit(ip);

        if(!success){
            return NextResponse.json({success: false, error: 'Rate limit exceeded. Try again later.'});
        }

        const searchParams = request.nextUrl.searchParams;
        const categories = searchParams.getAll("category")
        const category = categories.length ? categories : undefined
        const page = searchParams.get("page") || undefined;
        const country = searchParams.get("country") || undefined;
        const timeframe = searchParams.get("timeframe") || undefined;

        const result = await getNews(category, page, country, timeframe);
        return NextResponse.json(result);
    } catch (error) {
        const statusCode = (error as Error).message.includes('Invalid') ? 400 : 500;
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: statusCode }
        );
    }
}