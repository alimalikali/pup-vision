import { NextResponse } from "next/server"
import { mockInterests } from "@/lib/mock-data"

export async function GET() {
  try {
    // In real app, fetch interests for the current user
    return NextResponse.json(mockInterests)
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
