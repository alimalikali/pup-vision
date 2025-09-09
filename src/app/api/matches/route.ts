import { type NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtUtils } from '@/lib/jwt';
import { Profile } from '@types';

const prisma = new PrismaClient();

// Helper function to calculate compatibility score
function calculateCompatibilityScore(userProfile: Profile, targetProfile: Profile): number {
  let score = 0;
  let factors = 0;

  // Purpose alignment (30% weight)
  if (userProfile.purposeDomain === targetProfile.purposeDomain) {
    score += 30;
  }
  if (userProfile.purposeArchetype === targetProfile.purposeArchetype) {
    score += 20;
  }
  if (userProfile.purposeModality === targetProfile.purposeModality) {
    score += 10;
  }
  factors += 60;

  // Education compatibility (15% weight)
  const educationLevels = {
    NONE: 0,
    PRIMARY: 1,
    SECONDARY: 2,
    HIGH_SCHOOL: 3,
    BACHELORS: 4,
    MASTERS: 5,
    PHD: 6,
    SELF_TAUGHT: 3,
    OTHER: 2,
  };
  const userEduLevel = educationLevels[userProfile.education as keyof typeof educationLevels] || 0;
  const targetEduLevel = educationLevels[targetProfile.education as keyof typeof educationLevels] || 0;
  const eduDiff = Math.abs(userEduLevel - targetEduLevel);
  const eduScore = Math.max(0, 15 - eduDiff * 3);
  score += eduScore;
  factors += 15;

  // Interest overlap (20% weight)
  const userInterests = new Set(userProfile.interests || []);
  const targetInterests = new Set(targetProfile.interests || []);
  const commonInterests = new Set([...userInterests].filter(x => targetInterests.has(x)));
  const interestScore = (commonInterests.size / Math.max(userInterests.size, targetInterests.size, 1)) * 20;
  score += interestScore;
  factors += 20;

  // Lifestyle compatibility (15% weight)
  if (userProfile.smoke === targetProfile.smoke) score += 5;
  if (userProfile.alcohol === targetProfile.alcohol) score += 5;
  if (userProfile.drugs === targetProfile.drugs) score += 5;
  factors += 15;

  // Age compatibility (10% weight) - assuming age is calculated from DOB
  const userAge = userProfile.dob ? Math.floor((Date.now() - new Date(userProfile.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 25;
  const targetAge = targetProfile.dob ? Math.floor((Date.now() - new Date(targetProfile.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 25;
  const ageDiff = Math.abs(userAge - targetAge);
  const ageScore = Math.max(0, 10 - ageDiff / 2);
  score += ageScore;
  factors += 10;

  // Location compatibility (10% weight) - simplified
  if (userProfile.city === targetProfile.city) score += 10;
  else if (userProfile.state === targetProfile.state) score += 5;
  factors += 10;

  return Math.round((score / factors) * 100);
}

export async function GET(request: NextRequest) {
  try {
    console.log('[Matches API] Starting matches fetch...');

    // Get access token from cookie or Authorization header
    const accessToken = request.cookies.get('access-token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          message: 'No access token found',
        },
        { status: 401 }
      );
    }

    // Verify access token
    const decoded = jwtUtils.verifyAccessToken(accessToken);
    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid access token',
        },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '20');
    const includeCompatibility = searchParams.get('includeCompatibility') === 'true';

    // Filter parameters
    const ageMin = parseInt(searchParams.get('ageMin') || '18');
    const ageMax = parseInt(searchParams.get('ageMax') || '100');
    const gender = searchParams.get('gender');
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const education = searchParams.get('education');
    const profession = searchParams.get('profession');
    const purposeDomain = searchParams.get('purposeDomain');
    const interests = searchParams.get('interests')?.split(',').filter(Boolean) || [];

    console.log('[Matches API] Fetching user profile for compatibility calculation...');

    // Get current user's profile for compatibility calculation
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { profile: true },
    });

    if (!currentUser?.profile) {
      return NextResponse.json(
        {
          success: false,
          message: 'User profile not found',
        },
        { status: 404 }
      );
    }

    // Build where clause for filtering
    const whereClause: Record<string, unknown> = {
      userId: { not: decoded.userId }, // Exclude current user
      isActive: true,
      // Age filter
      dob: {
        gte: new Date(Date.now() - (ageMax + 1) * 365.25 * 24 * 60 * 60 * 1000),
        lte: new Date(Date.now() - ageMin * 365.25 * 24 * 60 * 60 * 1000),
      },
    };

    if (gender) whereClause.gender = gender;
    if (city) whereClause.city = { contains: city, mode: 'insensitive' };
    if (state) whereClause.state = { contains: state, mode: 'insensitive' };
    if (education) whereClause.education = education;
    if (profession) whereClause.profession = profession;
    if (purposeDomain) whereClause.purposeDomain = purposeDomain;
    if (interests.length > 0) {
      whereClause.interests = { hasSome: interests };
    }

    // Add cursor-based pagination
    if (cursor) {
      whereClause.id = { gt: cursor };
    }

    console.log('[Matches API] Fetching profiles with filters...');

    // Fetch profiles with pagination
    const profiles = await prisma.profile.findMany({
      where: whereClause,
      take: limit + 1, // Take one extra to check if there are more
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            isVerified: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    // Check if there are more profiles
    const hasMore = profiles.length > limit;
    const profilesToReturn = hasMore ? profiles.slice(0, limit) : profiles;
    const nextCursor = hasMore ? profilesToReturn[profilesToReturn.length - 1].id : null;

    console.log(`[Matches API] Found ${profilesToReturn.length} profiles`);

    // Calculate compatibility scores if requested
    const profilesWithCompatibility = profilesToReturn.map(profile => {
      const baseProfile = {
        id: profile.id,
        userId: profile.userId,
        name: profile.name,
        avatar: profile.avatar,
        dob: profile.dob,
        gender: profile.gender,
        income: profile.income,
        religion: profile.religion,
        education: profile.education,
        profession: profile.profession,
        lat: profile.lat,
        lang: profile.lang,
        city: profile.city,
        state: profile.state,
        country: profile.country,
        purposeDomain: profile.purposeDomain,
        purposeArchetype: profile.purposeArchetype,
        purposeModality: profile.purposeModality,
        purposeNarrative: profile.purposeNarrative,
        interests: profile.interests,
        personality: profile.personality,
        maritalStatus: profile.maritalStatus,
        lookingFor: profile.lookingFor,
        language: profile.language,
        height: profile.height,
        weight: profile.weight,
        smoke: profile.smoke,
        alcohol: profile.alcohol,
        drugs: profile.drugs,
        politics: profile.politics,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
        admiredBy: profile.admiredBy,
        admiredUsers: profile.admiredUsers,
        user: profile.user,
      };

      if (includeCompatibility) {
        const compatibilityScore = calculateCompatibilityScore(currentUser.profile, profile);
        return {
          ...baseProfile,
          compatibilityScore,
          age: profile.dob ? Math.floor((Date.now() - new Date(profile.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null,
        };
      }

      return {
        ...baseProfile,
        age: profile.dob ? Math.floor((Date.now() - new Date(profile.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null,
      };
    });

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      data: profilesWithCompatibility,
      pagination: {
        cursor: nextCursor,
        hasMore,
        limit,
      },
    });
  } catch (error) {
    console.error('[Matches API] Error fetching matches:', error);
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
