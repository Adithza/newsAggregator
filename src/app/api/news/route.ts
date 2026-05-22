import { NextRequest, NextResponse } from "next/server";
import { getNews } from "@/lib/getNews";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get("category") || undefined;
        const page = searchParams.get("page") || undefined;

        const result = await getNews(category, page);
        return NextResponse.json(result);
    } catch (error) {
        const statusCode = (error as Error).message.includes('Invalid') ? 400 : 500;
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: statusCode }
        );
    }
}