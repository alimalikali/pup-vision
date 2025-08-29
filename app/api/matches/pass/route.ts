import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { matchId } = await request.json()

    if (!matchId) {
      return NextResponse.json({ success: false, message: "Match ID is required" }, { status: 400 })
    }

    // Mock pass action - in real app, save to database
    console.log("[v0] User passed on match:", matchId)

    return NextResponse.json({
      success: true,
      message: "Pass recorded successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
