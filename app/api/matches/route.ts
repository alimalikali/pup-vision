import { NextResponse } from "next/server"
import { mockMatches } from "@/lib/mock-data"

export async function GET() {
  try {
    // In real app, fetch matches based on user preferences and compatibility
    return NextResponse.json(mockMatches)
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
