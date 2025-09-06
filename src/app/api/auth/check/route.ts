import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'
import { jwtUtils } from '@/lib/jwt'
import { AuthUser } from '@/types/auth'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log("[Auth Check] Starting authentication check...")
    
    // Get access token from cookie or Authorization header
    const accessToken = request.cookies.get("access-token")?.value || 
                       request.headers.get('authorization')?.replace('Bearer ', '')
    
    console.log("[Auth Check] Access token found:", accessToken ? "Yes" : "No")

    if (!accessToken) {
      console.log("[Auth Check] No access token found, returning 401")
      return NextResponse.json({ 
        success: false, 
        message: "No access token found" 
      }, { status: 401 })
    }

    // Verify access token
    const decoded = jwtUtils.verifyAccessToken(accessToken)
    console.log("[Auth Check] Access token verification result:", decoded ? "Valid" : "Invalid")
    
    if (!decoded) {
      console.log("[Auth Check] Invalid access token, returning 401")
      return NextResponse.json({ 
        success: false, 
        message: "Invalid access token" 
      }, { status: 401 })
    }

    console.log("[Auth Check] Access token valid, fetching user from database...")
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { profile: true }
    })

    console.log("[Auth Check] User found:", user ? "Yes" : "No")
    if (user) {
      console.log("[Auth Check] User active:", user.isActive ? "Yes" : "No")
    }

    if (!user || !user.isActive) {
      console.log("[Auth Check] User not found or inactive, returning 401")
      return NextResponse.json({ 
        success: false, 
        message: "User not found or inactive" 
      }, { status: 401 })
    }

    // Remove password hash and sensitive fields from user object
    const { passwordHash, ...userWithoutSensitiveData } = user

    // Convert to AuthUser DTO
    const authUser: AuthUser = {
      id: userWithoutSensitiveData.id,
      email: userWithoutSensitiveData.email,
      name: userWithoutSensitiveData.profile?.name,
      role: userWithoutSensitiveData.role,
      avatar: userWithoutSensitiveData.profile?.avatar,
      isVerified: userWithoutSensitiveData.isVerified,
      isActive: userWithoutSensitiveData.isActive,
      isNew: userWithoutSensitiveData.profile?.isNew ?? true,
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

    console.log("[Auth Check] Authentication successful for user:", user.email)
    await prisma.$disconnect()
    return NextResponse.json({
      success: true,
      user: authUser,
      message: "Authenticated"
    })
  } catch (error) {
    console.error("[Auth Check] Error during authentication check:", error)
    await prisma.$disconnect()
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error" 
    }, { status: 500 })
  }
}
