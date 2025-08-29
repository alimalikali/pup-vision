import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { planId } = await request.json()

    if (!planId) {
      return NextResponse.json({ success: false, message: "Plan ID is required" }, { status: 400 })
    }

    // Mock plan change - in real app, update with payment provider
    const planPrices = {
      free: 0,
      premium: 29.99,
      elite: 59.99,
    }

    const updatedSubscription = {
      plan: planId,
      amount: planPrices[planId as keyof typeof planPrices] || 0,
      currency: "USD",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
    }

    console.log("[v0] Plan changed to:", planId)

    return NextResponse.json(updatedSubscription)
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
