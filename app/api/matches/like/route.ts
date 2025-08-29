import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { matchId } = await request.json()

    if (!matchId) {
      return NextResponse.json({ success: false, message: "Match ID is required" }, { status: 400 })
    }

    // Mock like action - in real app, save to database and check for mutual match
    console.log("[v0] User liked match:", matchId)

    // Simulate mutual match check
    const isMutualMatch = Math.random() > 0.7 // 30% chance of mutual match

    return NextResponse.json({
      success: true,
      isMutualMatch,
      message: isMutualMatch ? "It's a match!" : "Like sent successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
