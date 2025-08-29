import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock user profile data - in real app, fetch from database based on authenticated user
    const profile = {
      id: "1",
      name: "John Doe",
      age: 32,
      avatar: "/professional-man.png",
      city: "San Francisco",
      state: "California",
      profession: "Senior Software Engineer",
      education: "Masters in Computer Science",
      company: "Tech Innovations Inc.",
      bio: "Passionate about building technology that makes a positive impact. Love hiking, cooking, and exploring new places. Looking for someone who shares my values and ambition.",
      purpose: {
        domain: "Technology & Innovation",
        archetype: "The Creator",
        modality: "Collaborative",
        narrative:
          "Building meaningful technology that connects people and solves real-world problems while fostering innovation through collaborative teamwork.",
      },
      interests: ["Technology", "Hiking", "Cooking", "Travel", "Photography", "Reading"],
      lifestyle: {
        smoking: "Never",
        drinking: "Socially",
        exercise: "Regularly",
      },
      photos: ["/professional-man.png", "/professional-engineer.png", "/professional-woman-smiling.png"],
      stats: {
        profileViews: 47,
        likes: 12,
        matches: 8,
        completion: 85,
      },
      preferences: {
        ageRange: { min: 25, max: 38 },
        location: "Within 50 miles",
        education: "Bachelor's or higher",
        lookingFor: "Long-term relationship",
      },
    }

    return NextResponse.json(profile)
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const profileData = await request.json()

    // Mock profile update - in real app, validate and save to database
    console.log("[v0] Updating profile:", profileData)

    // Simulate profile completion calculation
    const completionScore = calculateProfileCompletion(profileData)

    const updatedProfile = {
      ...profileData,
      stats: {
        ...profileData.stats,
        completion: completionScore,
      },
    }

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      message: "Profile updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

function calculateProfileCompletion(profile: any): number {
  let score = 0
  const maxScore = 100

  // Basic info (30 points)
  if (profile.name) score += 5
  if (profile.age) score += 5
  if (profile.profession) score += 5
  if (profile.education) score += 5
  if (profile.bio && profile.bio.length > 50) score += 10

  // Photos (25 points)
  if (profile.photos && profile.photos.length >= 1) score += 10
  if (profile.photos && profile.photos.length >= 3) score += 10
  if (profile.photos && profile.photos.length >= 5) score += 5

  // Interests (15 points)
  if (profile.interests && profile.interests.length >= 3) score += 10
  if (profile.interests && profile.interests.length >= 6) score += 5

  // Lifestyle (15 points)
  if (profile.lifestyle?.smoking) score += 5
  if (profile.lifestyle?.drinking) score += 5
  if (profile.lifestyle?.exercise) score += 5

  // Purpose (15 points)
  if (profile.purpose?.domain) score += 5
  if (profile.purpose?.archetype) score += 5
  if (profile.purpose?.narrative && profile.purpose.narrative.length > 100) score += 5

  return Math.min(score, maxScore)
}
