import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { interestId } = await request.json()

    if (!interestId) {
      return NextResponse.json({ success: false, message: "Interest ID is required" }, { status: 400 })
    }

    // Mock like back action - in real app, create mutual match
    console.log("[v0] User liked back interest:", interestId)

    return NextResponse.json({
      success: true,
      isMutualMatch: true,
      message: "It's a match!",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
