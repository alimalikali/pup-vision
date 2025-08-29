import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock user settings - in real app, fetch from database based on authenticated user
    const settings = {
      // Account Settings
      email: "demo@pup.com",
      phone: "+1 (555) 123-4567",
      language: "en",
      timezone: "America/New_York",

      // Privacy Settings
      profileVisibility: "public",
      showOnlineStatus: true,
      showLastSeen: false,
      allowMessagesFrom: "matches",
      hideFromColleagues: true,

      // Notification Settings
      emailNotifications: {
        newMatches: true,
        messages: true,
        likes: false,
        profileViews: false,
        marketing: false,
      },
      pushNotifications: {
        newMatches: true,
        messages: true,
        likes: true,
        profileViews: false,
      },

      // Appearance
      theme: "system",
      compactMode: false,
    }

    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const settingsData = await request.json()

    // Mock settings update - in real app, validate and save to database
    console.log("[v0] Updating settings:", settingsData)

    return NextResponse.json({
      success: true,
      settings: settingsData,
      message: "Settings updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
