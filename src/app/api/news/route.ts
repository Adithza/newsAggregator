import { NextRequest, NextResponse } from "next/server";
import { fetchGuardianHeadlines} from "@/lib/guardianNews";

export async function GET(request: NextRequest) {
    try{

        const searchParams = request.nextUrl.searchParams;

        const category = searchParams.get("category") || undefined;
        let articles;
       
        articles = await fetchGuardianHeadlines(category);

        return NextResponse.json({success: true, articles});

    }catch(error){
        return NextResponse.json({success: false, error: (error as Error).message}, {status: 500});
    }
}