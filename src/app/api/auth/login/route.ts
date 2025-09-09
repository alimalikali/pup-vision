import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { passwordUtils, jwtUtils } from '@/lib/jwt';
import { AuthUser, Role } from '@types';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email and password are required',
        },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await passwordUtils.comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: 'Account is deactivated',
        },
        { status: 401 }
      );
    }

    // Generate access and refresh tokens
    const accessToken = jwtUtils.generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = jwtUtils.generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    console.log('[Login API] Generated tokens for user:', user.email);

    // Remove password hash and sensitive fields from user object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userWithoutSensitiveData } = user;

    // Convert to AuthUser DTO
    const authUser: AuthUser = {
      id: userWithoutSensitiveData.id,
      email: userWithoutSensitiveData.email,
      role: userWithoutSensitiveData.role as Role,
      name: userWithoutSensitiveData.profile?.name,
      avatar: userWithoutSensitiveData.profile?.avatar,
      isVerified: userWithoutSensitiveData.isVerified,
      isActive: userWithoutSensitiveData.isActive,
      isNew: userWithoutSensitiveData.profile?.isNew ?? true,
      createdAt: userWithoutSensitiveData.createdAt,
      updatedAt: userWithoutSensitiveData.updatedAt,
      profile: userWithoutSensitiveData.profile
        ? {
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
          }
        : undefined,
    };

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: authUser,
      message: 'Login successful',
    });

    // Set HTTP-only cookie with refresh token
    response.cookies.set('refresh-token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Set access token in a separate cookie (for client-side access if needed)
    response.cookies.set('access-token', accessToken, {
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
    });

    await prisma.$disconnect();
    return response;
  } catch (error) {
    console.error('Login error:', error);
    await prisma.$disconnect();
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
