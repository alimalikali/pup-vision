import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, message: "Password must be at least 8 characters" }, { status: 400 })
    }

    // Mock user creation - in real app, save to database
    const user = {
      id: Date.now().toString(),
      name,
      email,
      avatar: "/placeholder.svg",
      profileCompletion: 25,
      memberSince: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      subscription: {
        plan: "free" as const,
        status: "active" as const,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    }

    return NextResponse.json({
      success: true,
      user,
      message: "Account created successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
