import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({  "status": "UP",  "description": new Date().toISOString() }, { status: 200 });
}
