import { NextRequest, NextResponse } from "next/server";
import { getNews } from "@/lib/getNews";
import { newsRatelimit } from "@/lib/rateLimit";

export async function GET(request: NextRequest) {
    try {

        const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1";

        if (process.env.NODE_ENV === "test") {

        } else {
        const { success } = await newsRatelimit.limit(ip);

        if (!success) {
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
        const country = searchParams.get("country") || undefined;
        const startDate = searchParams.get("startDate") || undefined;
        const endDate = searchParams.get("endDate") || undefined;

        console.log('[API /api/news] searchParams:', {
            category,
            page,
            country,
            startDate,
            endDate,
        })

        const result = await getNews(category, page, country, startDate, endDate);
        return NextResponse.json(result);
    } catch (error) {
        const statusCode = (error as Error).message.includes('Invalid') ? 400 : 500;
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: statusCode }
        );
    }
}