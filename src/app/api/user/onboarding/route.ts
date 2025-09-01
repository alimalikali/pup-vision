import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'
import { jwtUtils } from '@/lib/jwt'
import { AuthUser } from '@/types/auth'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log("[Onboarding] Starting onboarding completion...")
    
    // Get access token from cookie or Authorization header
    const accessToken = request.cookies.get("access-token")?.value || 
                       request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!accessToken) {
      return NextResponse.json({ 
        success: false, 
        message: "No access token found" 
      }, { status: 401 })
    }

    // Verify access token
    const decoded = jwtUtils.verifyAccessToken(accessToken)
    
    if (!decoded) {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid access token" 
      }, { status: 401 })
    }

    const currentUserId = decoded.userId
    const profileData = await request.json()
    
    console.log("[Onboarding] Received profile data for user:", currentUserId)

    // Update the profile with the onboarding data
    const updatedProfile = await prisma.profile.update({
      where: { userId: currentUserId },
      data: {
        name: profileData.name,
        avatar: profileData.avatar,
        dob: profileData.dob ? new Date(profileData.dob) : null,
        gender: profileData.gender,
        income: profileData.income ? Number(profileData.income) : null,
        religion: profileData.religion,
        education: profileData.education,
        profession: profileData.profession,
        lat: profileData.lat ? Number(profileData.lat) : null,
        lang: profileData.lang ? Number(profileData.lang) : null,
        city: profileData.city,
        state: profileData.state,
        country: profileData.country,
        purposeDomain: profileData.purposeDomain,
        purposeArchetype: profileData.purposeArchetype,
        purposeModality: profileData.purposeModality,
        purposeNarrative: profileData.purposeNarrative,
        interests: profileData.interests,
        personality: profileData.personality,
        maritalStatus: profileData.maritalStatus,
        lookingFor: profileData.lookingFor,
        language: profileData.language,
        height: profileData.height ? Number(profileData.height) : null,
        weight: profileData.weight ? Number(profileData.weight) : null,
        smoke: profileData.smoke,
        alcohol: profileData.alcohol,
        drugs: profileData.drugs,
        politics: profileData.politics,
        isNew: false, // Mark onboarding as complete
        updatedAt: new Date()
      }
    })

    console.log("[Onboarding] Profile updated successfully")

    // Fetch the updated user with profile
    const user = await prisma.user.findUnique({
      where: { id: currentUserId },
      include: { profile: true }
    })

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: "User not found" 
      }, { status: 404 })
    }

    // Remove password hash and sensitive fields from user object
    const { passwordHash, ...userWithoutSensitiveData } = user

    // Convert to AuthUser DTO
    const authUser: AuthUser = {
      id: userWithoutSensitiveData.id,
      email: userWithoutSensitiveData.email,
      name: userWithoutSensitiveData.profile?.name,
      avatar: userWithoutSensitiveData.profile?.avatar,
      role: userWithoutSensitiveData.role,
      isVerified: userWithoutSensitiveData.isVerified,
      isActive: userWithoutSensitiveData.isActive,
      isNew: userWithoutSensitiveData.profile?.isNew ?? false,
      createdAt: userWithoutSensitiveData.createdAt,
      updatedAt: userWithoutSensitiveData.updatedAt,
      profile: userWithoutSensitiveData.profile ? {
        id: userWithoutSensitiveData.profile.id,
        userId: userWithoutSensitiveData.profile.userId,
        name: userWithoutSensitiveData.profile.name,
        avatar: userWithoutSensitiveData.profile.avatar,
        dob: userWithoutSensitiveData.profile.dob,
        gender: userWithoutSensitiveData.profile.gender,
        income: userWithoutSensitiveData.profile.income,
        religion: userWithoutSensitiveData.profile.religion,
        education: userWithoutSensitiveData.profile.education,
        profession: userWithoutSensitiveData.profile.profession,
        lat: userWithoutSensitiveData.profile.lat,
        lang: userWithoutSensitiveData.profile.lang,
        city: userWithoutSensitiveData.profile.city,
        state: userWithoutSensitiveData.profile.state,
        country: userWithoutSensitiveData.profile.country,
        purposeDomain: userWithoutSensitiveData.profile.purposeDomain,
        purposeArchetype: userWithoutSensitiveData.profile.purposeArchetype,
        purposeModality: userWithoutSensitiveData.profile.purposeModality,
        purposeNarrative: userWithoutSensitiveData.profile.purposeNarrative,
        interests: userWithoutSensitiveData.profile.interests,
        personality: userWithoutSensitiveData.profile.personality,
        maritalStatus: userWithoutSensitiveData.profile.maritalStatus,
        lookingFor: userWithoutSensitiveData.profile.lookingFor,
        language: userWithoutSensitiveData.profile.language,
        height: userWithoutSensitiveData.profile.height,
        weight: userWithoutSensitiveData.profile.weight,
        smoke: userWithoutSensitiveData.profile.smoke,
        alcohol: userWithoutSensitiveData.profile.alcohol,
        drugs: userWithoutSensitiveData.profile.drugs,
        politics: userWithoutSensitiveData.profile.politics,
        createdAt: userWithoutSensitiveData.profile.createdAt,
        updatedAt: userWithoutSensitiveData.profile.updatedAt,
        admiredBy: userWithoutSensitiveData.profile.admiredBy,
        admiredUsers: userWithoutSensitiveData.profile.admiredUsers,
      } : undefined
    }

    console.log("[Onboarding] Onboarding completed successfully for user:", user.email)
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: true,
      user: authUser,
      message: "Onboarding completed successfully"
    })
  } catch (error) {
    console.error("[Onboarding] Error during onboarding completion:", error)
    await prisma.$disconnect()
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : "Internal server error" 
    }, { status: 500 })
  }
}
