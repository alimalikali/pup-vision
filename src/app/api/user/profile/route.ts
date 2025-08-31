import { type NextRequest, NextResponse } from "next/server"
import { validateProfile } from "@/validation/validation"
import { PrismaClient } from '@prisma/client'
import { jwtUtils } from '@/lib/jwt'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Get current user ID from auth token
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ success: false, message: "No authentication token" }, { status: 401 })
    }

    // Verify token
    const decoded = jwtUtils.verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
    }

    const currentUserId = decoded.userId

    // Fetch user profile from database
    const user = await prisma.user.findUnique({
      where: { id: currentUserId },
      include: {
        profile: true
      }
    })

    if (!user || !user.profile) {
      return NextResponse.json({ success: false, message: "Profile not found" }, { status: 404 })
    }

    const profile = user.profile

    // Calculate age from date of birth
    const age = profile.dob ? Math.floor((Date.now() - new Date(profile.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 0

    // Return the profile data directly from the schema
    const profileData = {
      ...profile,
      age: age,
      // Add computed fields for frontend compatibility
      bio: profile.purposeNarrative || "No bio available",
      purpose: {
        domain: profile.purposeDomain,
        archetype: profile.purposeArchetype,
        modality: profile.purposeModality,
        narrative: profile.purposeNarrative
      },
      photos: profile.avatar ? [profile.avatar] : [],
      stats: {
        profileViews: 47, // Mock data for now
        likes: 12,
        matches: 8,
        completion: calculateProfileCompletion(profile)
      },
      preferences: {
        ageRange: { min: 25, max: 40 }, // Default values
        location: "Within 50 miles",
        education: "Bachelor's or higher",
        lookingFor: profile.lookingFor
      },
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString()
    }

    await prisma.$disconnect()
    return NextResponse.json({
      success: true,
      profile: profileData
    })
  } catch (error) {
    console.error("Profile GET error:", error)
    await prisma.$disconnect()
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get current user ID from auth token
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ success: false, message: "No authentication token" }, { status: 401 })
    }

    // Verify token
    const decoded = jwtUtils.verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
    }

    const currentUserId = decoded.userId
    const profileData = await request.json()
    
    // Log the incoming data for debugging
    console.log("[v0] Received profile data:", JSON.stringify(profileData, null, 2))

    // Validate the incoming data against our schema
    const validation = validateProfile(profileData, true) // true for update
    
    if (!validation.success) {
      console.log("[v0] Validation failed:", validation.errors)
      return NextResponse.json({
        success: false,
        message: "Validation failed",
        errors: validation.errors
      }, { status: 400 })
    }

    try {
      // First check if the user and profile exist
      const existingUser = await prisma.user.findUnique({
        where: { id: currentUserId },
        include: { profile: true }
      })

      if (!existingUser) {
        console.log("[v0] User not found with ID:", currentUserId)
        await prisma.$disconnect()
        return NextResponse.json({
          success: false,
          message: "User not found"
        }, { status: 404 })
      }

      if (!existingUser.profile) {
        console.log("[v0] Profile not found for user:", currentUserId)
        await prisma.$disconnect()
        return NextResponse.json({
          success: false,
          message: "Profile not found"
        }, { status: 404 })
      }

      console.log("[v0] Found existing user:", existingUser.id)
      console.log("[v0] Existing profile:", existingUser.profile.id)

      // Update the profile
      const updatedProfile = await prisma.profile.update({
        where: { id: existingUser.profile.id },
        data: {
          name: profileData.name,
          avatar: profileData.avatar,
          dob: profileData.dob ? new Date(profileData.dob) : null,
          gender: profileData.gender,
          income: profileData.income ? parseInt(profileData.income) : null,
          religion: profileData.religion,
          education: profileData.education,
          profession: profileData.profession,
          city: profileData.city,
          state: profileData.state,
          country: profileData.country,
          purposeDomain: profileData.purposeDomain,
          purposeArchetype: profileData.purposeArchetype,
          purposeModality: profileData.purposeModality,
          purposeNarrative: profileData.purposeNarrative,
          personality: profileData.personality,
          maritalStatus: profileData.maritalStatus,
          lookingFor: profileData.lookingFor,
          language: profileData.language,
          height: profileData.height ? parseFloat(profileData.height) : null,
          weight: profileData.weight ? parseFloat(profileData.weight) : null,
          smoke: profileData.smoke,
          alcohol: profileData.alcohol,
          drugs: profileData.drugs,
          politics: profileData.politics || [],
          interests: profileData.interests || [],
          isNew: false, // Mark as completed onboarding
          isActive: true,
          updatedAt: new Date()
        }
      })

      await prisma.$disconnect()

      console.log("[v0] Profile updated successfully:", updatedProfile.id)

      // Calculate profile completion
      const completionScore = calculateProfileCompletion(updatedProfile)

      // Return the updated profile in the same format as GET
      const age = updatedProfile.dob ? Math.floor((Date.now() - new Date(updatedProfile.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 0

      const transformedProfile = {
        id: updatedProfile.id,
        userId: updatedProfile.userId,
        name: updatedProfile.name,
        age: age,
        dob: updatedProfile.dob,
        avatar: updatedProfile.avatar,
        city: updatedProfile.city,
        state: updatedProfile.state,
        country: updatedProfile.country,
        profession: updatedProfile.profession,
        education: updatedProfile.education,
        gender: updatedProfile.gender,
        religion: updatedProfile.religion,
        income: updatedProfile.income,
        height: updatedProfile.height,
        weight: updatedProfile.weight,
        personality: updatedProfile.personality,
        maritalStatus: updatedProfile.maritalStatus,
        lookingFor: updatedProfile.lookingFor,
        language: updatedProfile.language,
        purposeDomain: updatedProfile.purposeDomain,
        purposeArchetype: updatedProfile.purposeArchetype,
        purposeModality: updatedProfile.purposeModality,
        purposeNarrative: updatedProfile.purposeNarrative,
        interests: updatedProfile.interests,
        smoke: updatedProfile.smoke,
        alcohol: updatedProfile.alcohol,
        drugs: updatedProfile.drugs,
        politics: updatedProfile.politics,
        bio: updatedProfile.purposeNarrative || "No bio available",
        purpose: {
          domain: updatedProfile.purposeDomain,
          archetype: updatedProfile.purposeArchetype,
          modality: updatedProfile.purposeModality,
          narrative: updatedProfile.purposeNarrative
        },
        lifestyle: {
          smoking: updatedProfile.smoke,
          drinking: updatedProfile.alcohol,
          exercise: updatedProfile.drugs
        },
        photos: updatedProfile.avatar ? [updatedProfile.avatar] : [],
        stats: {
          profileViews: 47,
          likes: 12,
          matches: 8,
          completion: completionScore,
        },
        preferences: {
          ageRange: { min: 25, max: 40 },
          location: "Within 50 miles",
          education: "Bachelor's or higher",
          lookingFor: updatedProfile.lookingFor
        },
        isNew: updatedProfile.isNew,
        isActive: updatedProfile.isActive,
        createdAt: updatedProfile.createdAt.toISOString(),
        updatedAt: updatedProfile.updatedAt.toISOString()
      }

      return NextResponse.json({
        success: true,
        profile: transformedProfile,
        message: "Profile updated successfully",
      })

    } catch (dbError) {
      console.error("[v0] Database error:", dbError)
      await prisma.$disconnect()
      return NextResponse.json({
        success: false,
        message: "Failed to update profile in database"
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Profile update error:", error)
    await prisma.$disconnect()
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

function calculateProfileCompletion(profile: any): number {
  let score = 0
  const maxScore = 100

  // Basic info (30 points)
  if (profile.name) score += 5
  if (profile.dob) score += 5
  if (profile.profession) score += 5
  if (profile.education) score += 5
  if (profile.purposeNarrative && profile.purposeNarrative.length > 50) score += 10

  // Location (15 points)
  if (profile.city) score += 5
  if (profile.state) score += 5
  if (profile.country) score += 5

  // Purpose (20 points)
  if (profile.purposeDomain) score += 5
  if (profile.purposeArchetype) score += 5
  if (profile.purposeModality) score += 5
  if (profile.purposeNarrative && profile.purposeNarrative.length > 100) score += 5

  // Interests (15 points)
  if (profile.interests && profile.interests.length >= 3) score += 10
  if (profile.interests && profile.interests.length >= 6) score += 5

  // Lifestyle (20 points)
  if (profile.smoke) score += 5
  if (profile.alcohol) score += 5
  if (profile.drugs) score += 5
  if (profile.personality) score += 5

  return Math.min(score, maxScore)
}
