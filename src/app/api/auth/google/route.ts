import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { jwtUtils } from '@/lib/jwt'
import { Profile } from '@/types/types'

const prisma = new PrismaClient()

// Helper function to parse duration string to seconds
function parseDuration(duration: string): number {
  const units = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60,
  };

  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 0;

  const [, value, unit] = match;
  return parseInt(value) * units[unit as keyof typeof units];
}

// Helper function to get cookie options
function getCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}

export async function GET(request: NextRequest) {
  try {
    console.log("Google OAuth callback route hit!")
    
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    console.log("Code:", code ? "Present" : "Missing")
    console.log("Error:", error)

    if (error) {
      console.error("Google OAuth error:", error)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login?error=google_auth_failed`
      )
    }

    if (!code) {
      console.error("No authorization code received")
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login?error=no_auth_code`
      )
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      }),
    })

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", await tokenResponse.text())
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login?error=token_exchange_failed`
      )
    }

    const tokenData = await tokenResponse.json()
    const { access_token } = tokenData

    // Get user info from Google
    const userInfoResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
    )

    if (!userInfoResponse.ok) {
      console.error("User info fetch failed:", await userInfoResponse.text())
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login?error=user_info_failed`
      )
    }

    const userInfo = await userInfoResponse.json()
    console.log("Google user info:", userInfo)

    // For now, we'll redirect to onboarding with user data
    // In production, you would create/update user in database and set JWT cookies
    const redirectUrl = new URL("/onboarding", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
    redirectUrl.searchParams.set("google_user", JSON.stringify({
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      verified: userInfo.verified_email
    }))

    console.log("Redirecting to:", redirectUrl.toString())
    return NextResponse.redirect(redirectUrl.toString())

  } catch (error) {
    console.error("Google OAuth callback error:", error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login?error=callback_failed`
    )
  }
}

// POST method for client-side Google auth
export async function POST(request: NextRequest) {
  try {
    const { access_token } = await request.json()

    if (!access_token) {
      return NextResponse.json({ 
        success: false,
        message: 'Access token is required' 
      }, { status: 400 })
    }

    // Get user info from Google
    const userInfoResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
    )

    if (!userInfoResponse.ok) {
      return NextResponse.json({ 
        success: false,
        message: 'Failed to get user info from Google' 
      }, { status: 400 })
    }

    const userInfo = await userInfoResponse.json()

    // Check if user already exists in database
    let existingUser = null
    let isNewUser = true

    try {
      // Check if user exists by email
      existingUser = await prisma.user.findUnique({
        where: { email: userInfo.email },
        include: {
          profile: true
        }
      })

      if (existingUser) {
        isNewUser = false
        console.log('Existing user found:', existingUser.email)
      } else {
        console.log('New user signing up:', userInfo.email)
        
        // Create new user in database
        const newUser = await prisma.user.create({
          data: {
            email: userInfo.email,
            passwordHash: 'google-oauth-user', // Placeholder for Google OAuth users
            isVerified: userInfo.verified_email,
            role: 'USER',
            profile: {
              create: {
                name: userInfo.name,
                avatar: userInfo.picture,
                gender: 'OTHER', // Default value, will be updated in onboarding
                religion: 'OTHER', // Default value, will be updated in onboarding
                education: 'OTHER', // Default value, will be updated in onboarding
                profession: 'OTHER', // Default value, will be updated in onboarding
                purposeDomain: 'PERSONAL', // Default value, will be updated in onboarding
                purposeArchetype: 'VISIONARY', // Default value, will be updated in onboarding
                purposeModality: 'INDIVIDUAL', // Default value, will be updated in onboarding
                personality: 'AMBIVERT', // Default value, will be updated in onboarding
                maritalStatus: 'SINGLE', // Default value, will be updated in onboarding
                lookingFor: 'SINGLE', // Default value, will be updated in onboarding
                language: 'ENGLISH', // Default value, will be updated in onboarding
                smoke: 'NO', // Default value, will be updated in onboarding
                alcohol: 'NO', // Default value, will be updated in onboarding
                drugs: 'NO', // Default value, will be updated in onboarding
                politics: [], // Default empty array
                interests: [], // Default empty array
                admiredBy: [],
                admiredUsers: [],
                isNew: true, // Mark as new user for onboarding
                isActive: true
              } as unknown as Profile
            }
          },
          include: {
            profile: true
          }
        })
        
        console.log('New user created:', newUser.id)
        existingUser = newUser
      }

      // Generate JWT token
      const token = jwtUtils.generateToken({
        userId: existingUser.id,
        email: existingUser.email
      })

      // Remove password hash from user object
      const { passwordHash, ...userWithoutPassword } = existingUser

      // Create response with user data
      const response = NextResponse.json({
        success: true,
        user: userWithoutPassword,
        message: 'Google authentication successful',
        isNewUser: isNewUser,
      })

      // Set HTTP-only cookie with JWT token
      response.cookies.set("access-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      })

      await prisma.$disconnect()
      return response

    } catch (dbError) {
      console.error('Database error:', dbError)
      await prisma.$disconnect()
      return NextResponse.json({ 
        success: false,
        message: 'Failed to process Google authentication' 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Google auth error:', error)
    return NextResponse.json({ 
      success: false,
      message: 'Internal server error' 
    }, { status: 500 })
  }
}
