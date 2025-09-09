import { jwtUtils } from '@/lib/jwt';
import { PrismaClient } from '@prisma/client';
import { AuthUser, Role } from '@types';
import { type NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('[Auth Check] Starting authentication check...');

    // Get access token from cookie or Authorization header
    const accessToken = request.cookies.get('access-token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');

    console.log('[Auth Check] Access token found:', accessToken ? 'Yes' : 'No');

    let decoded = null;
    let shouldRefresh = false;

    // If we have an access token, try to verify it
    if (accessToken) {
      decoded = jwtUtils.verifyAccessToken(accessToken);
      console.log('[Auth Check] Access token verification result:', decoded ? 'Valid' : 'Invalid');
    }

    // If no access token or invalid access token, try refresh token
    if (!decoded) {
      const refreshToken = request.cookies.get('refresh-token')?.value;
      console.log('[Auth Check] Refresh token found:', refreshToken ? 'Yes' : 'No');

      if (!refreshToken) {
        console.log('[Auth Check] No valid tokens found, returning 401');
        return NextResponse.json(
          {
            success: false,
            message: 'No valid tokens found',
          },
          { status: 401 }
        );
      }

      // Verify refresh token
      const refreshDecoded = jwtUtils.verifyRefreshToken(refreshToken);
      console.log('[Auth Check] Refresh token verification result:', refreshDecoded ? 'Valid' : 'Invalid');

      if (!refreshDecoded) {
        console.log('[Auth Check] Invalid refresh token, returning 401');
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid refresh token',
          },
          { status: 401 }
        );
      }

      // Use refresh token data for user lookup
      decoded = refreshDecoded;
      shouldRefresh = true;
    }

    console.log('[Auth Check] Access token valid, fetching user from database...');
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { profile: true },
    });

    console.log('[Auth Check] User found:', user ? 'Yes' : 'No');
    if (user) {
      console.log('[Auth Check] User active:', user.isActive ? 'Yes' : 'No');
    }

    if (!user || !user.isActive) {
      console.log('[Auth Check] User not found or inactive, returning 401');
      return NextResponse.json(
        {
          success: false,
          message: 'User not found or inactive',
        },
        { status: 401 }
      );
    }

    // Remove password hash and sensitive fields from user object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userWithoutSensitiveData } = user;

    // Convert to AuthUser DTO
    const authUser: AuthUser = {
      id: userWithoutSensitiveData.id,
      email: userWithoutSensitiveData.email,
      name: userWithoutSensitiveData.profile?.name,
      role: userWithoutSensitiveData.role as Role,
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

    console.log('[Auth Check] Authentication successful for user:', user.email);

    // If we used refresh token, generate new access token
    if (shouldRefresh) {
      console.log('[Auth Check] Generating new access token from refresh token');
      const newAccessToken = jwtUtils.generateAccessToken({
        userId: user.id,
        email: user.email,
      });

      await prisma.$disconnect();
      const response = NextResponse.json({
        success: true,
        user: authUser,
        message: 'Authenticated with refreshed token',
      });

      // Set new access token cookie
      response.cookies.set('access-token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60, // 15 minutes
      });

      return response;
    }

    await prisma.$disconnect();
    return NextResponse.json({
      success: true,
      user: authUser,
      message: 'Authenticated',
    });
  } catch (error) {
    console.error('[Auth Check] Error during authentication check:', error);
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
