import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Mock authentication - in real app, validate against database
    if (email === "demo@pup.com" && password === "password") {
      const user = {
        id: "1",
        name: "John Doe",
        email: "demo@pup.com",
        avatar: "/professional-man.png",
        profileCompletion: 85,
        memberSince: "2024-01-15",
        lastActive: new Date().toISOString(),
        subscription: {
          plan: "premium" as const,
          status: "active" as const,
          currentPeriodEnd: "2024-03-01",
        },
      }

      return NextResponse.json({
        success: true,
        user,
        message: "Login successful",
      })
    }

    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
