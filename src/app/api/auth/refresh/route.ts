import { type NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtUtils } from '@/lib/jwt';
import { AuthUser, Role } from '@types';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('[Refresh Token] Starting token refresh...');

    // Get refresh token from cookie
    const refreshToken = request.cookies.get('refresh-token')?.value;

    console.log(
      '[Refresh Token] Refresh token found:',
      refreshToken ? 'Yes' : 'No'
    );

    if (!refreshToken) {
      console.log('[Refresh Token] No refresh token found, returning 401');
      return NextResponse.json(
        {
          success: false,
          message: 'No refresh token found',
        },
        { status: 401 }
      );
    }

    // Verify refresh token
    const decoded = jwtUtils.verifyRefreshToken(refreshToken);
    console.log(
      '[Refresh Token] Refresh token verification result:',
      decoded ? 'Valid' : 'Invalid'
    );

    if (!decoded) {
      console.log(
        '[Refresh Token] Invalid refresh token, clearing cookies and returning 401'
      );
      const response = NextResponse.json(
        {
          success: false,
          message: 'Invalid refresh token',
        },
        { status: 401 }
      );

      // Clear invalid tokens
      response.cookies.delete('access-token');
      response.cookies.delete('refresh-token');

      return response;
    }

    console.log(
      '[Refresh Token] Refresh token valid, fetching user from database...'
    );
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { profile: true },
    });

    console.log('[Refresh Token] User found:', user ? 'Yes' : 'No');
    if (user) {
      console.log('[Refresh Token] User active:', user.isActive ? 'Yes' : 'No');
    }

    if (!user || !user.isActive) {
      console.log(
        '[Refresh Token] User not found or inactive, clearing cookies and returning 401'
      );
      const response = NextResponse.json(
        {
          success: false,
          message: 'User not found or inactive',
        },
        { status: 401 }
      );

      // Clear invalid tokens
      response.cookies.delete('access-token');
      response.cookies.delete('refresh-token');

      return response;
    }

    // Generate new access token
    const newAccessToken = jwtUtils.generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    console.log(
      '[Refresh Token] Generated new access token for user:',
      user.email
    );

    // Remove password hash and sensitive fields from user object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userWithoutSensitiveData } = user;

    // Convert to AuthUser DTO
    const authUser: AuthUser = {
      id: userWithoutSensitiveData.id,
      email: userWithoutSensitiveData.email,
      name: userWithoutSensitiveData.profile?.name,
      avatar: userWithoutSensitiveData.profile?.avatar,
      role: userWithoutSensitiveData.role as Role ,
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
      message: 'Token refreshed successfully',
    });

    // Set new access token
    response.cookies.set('access-token', newAccessToken, {
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
    });

    console.log(
      '[Refresh Token] Token refresh successful for user:',
      user.email
    );
    await prisma.$disconnect();
    return response;
  } catch (error) {
    console.error('[Refresh Token] Error during token refresh:', error);
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
