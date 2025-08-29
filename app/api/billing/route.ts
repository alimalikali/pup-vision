import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock billing data - in real app, fetch from payment provider
    const billing = {
      subscription: {
        plan: "premium",
        amount: 29.99,
        currency: "USD",
        currentPeriodEnd: "2024-03-01",
        status: "active",
      },
      paymentHistory: [
        {
          id: "1",
          date: "2024-02-01",
          amount: 29.99,
          plan: "Premium",
          status: "paid",
          invoice: "INV-001",
        },
        {
          id: "2",
          date: "2024-01-01",
          amount: 29.99,
          plan: "Premium",
          status: "paid",
          invoice: "INV-002",
        },
      ],
    }

    return NextResponse.json(billing)
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
