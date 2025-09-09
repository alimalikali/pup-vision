import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtUtils } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    console.log('[Admire API] Processing admire/pass action...');

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

    const { targetUserId, action } = await request.json();

    if (!targetUserId || !action) {
      return NextResponse.json(
        {
          success: false,
          message: 'targetUserId and action are required',
        },
        { status: 400 }
      );
    }

    if (!['admire', 'pass'].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: "Action must be 'admire' or 'pass'",
        },
        { status: 400 }
      );
    }

    // Don't allow users to admire themselves
    if (targetUserId === decoded.userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Cannot admire yourself',
        },
        { status: 400 }
      );
    }

    // Check if target user exists and is active
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: { profile: true },
    });

    if (!targetUser || !targetUser.isActive || !targetUser.profile) {
      return NextResponse.json(
        {
          success: false,
          message: 'Target user not found or inactive',
        },
        { status: 404 }
      );
    }

    // Get current user's profile
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

    if (action === 'admire') {
      // Check if already admired
      if (currentUser.profile.admiredUsers.includes(targetUserId)) {
        return NextResponse.json(
          {
            success: false,
            message: 'Already admired this user',
          },
          { status: 400 }
        );
      }

      // Add to admired users list
      await prisma.profile.update({
        where: { userId: decoded.userId },
        data: {
          admiredUsers: {
            push: targetUserId,
          },
        },
      });

      // Add to target user's admiredBy list
      await prisma.profile.update({
        where: { userId: targetUserId },
        data: {
          admiredBy: {
            push: decoded.userId,
          },
        },
      });

      // Check if it's a mutual admiration (match)
      const isMutual = targetUser.profile.admiredUsers.includes(decoded.userId);

      if (isMutual) {
        // Create a match record
        await prisma.match.create({
          data: {
            userAId: decoded.userId,
            userBId: targetUserId,
            compatibilityScore: 85, // Default score, could be calculated
            status: 'MATCHED',
            initiatedById: decoded.userId,
          },
        });

        console.log('[Admire API] Mutual admiration - match created!');
      }

      return NextResponse.json({
        success: true,
        message: 'User admired successfully',
        isMutual,
      });
    } else if (action === 'pass') {
      // Remove from admired users if previously admired
      const updatedAdmiredUsers = currentUser.profile.admiredUsers.filter(id => id !== targetUserId);

      await prisma.profile.update({
        where: { userId: decoded.userId },
        data: {
          admiredUsers: updatedAdmiredUsers,
        },
      });

      // Remove from target user's admiredBy list
      const updatedAdmiredBy = targetUser.profile.admiredBy.filter(id => id !== decoded.userId);

      await prisma.profile.update({
        where: { userId: targetUserId },
        data: {
          admiredBy: updatedAdmiredBy,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'User passed successfully',
      });
    }
  } catch (error) {
    console.error('[Admire API] Error processing admire/pass:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('[Admire API] Fetching admire data...');

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

    // Get current user's profile with admire data
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        profile: {
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
        },
      },
    });

    if (!user?.profile) {
      return NextResponse.json(
        {
          success: false,
          message: 'User profile not found',
        },
        { status: 404 }
      );
    }

    // Get profiles of users I admire
    const admiredProfiles = await prisma.profile.findMany({
      where: {
        userId: { in: user.profile.admiredUsers },
      },
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

    // Get profiles of users who admire me
    const admirersProfiles = await prisma.profile.findMany({
      where: {
        userId: { in: user.profile.admiredBy },
      },
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

    // Get matches
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ userAId: decoded.userId }, { userBId: decoded.userId }],
        status: 'MATCHED',
      },
      include: {
        userA: {
          include: {
            profile: {
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
            },
          },
        },
        userB: {
          include: {
            profile: {
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
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        admired: admiredProfiles.map(profile => ({
          ...profile,
          age: profile.dob ? Math.floor((Date.now() - new Date(profile.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null,
        })),
        admirers: admirersProfiles.map(profile => ({
          ...profile,
          age: profile.dob ? Math.floor((Date.now() - new Date(profile.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null,
        })),
        matches: matches.map(match => ({
          id: match.id,
          compatibilityScore: match.compatibilityScore,
          status: match.status,
          createdAt: match.createdAt,
          updatedAt: match.updatedAt,
          otherUser:
            match.userAId === decoded.userId
              ? {
                  ...match.userB.profile,
                  age: match.userB.profile?.dob ? Math.floor((Date.now() - new Date(match.userB.profile.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null,
                }
              : {
                  ...match.userA.profile,
                  age: match.userA.profile?.dob ? Math.floor((Date.now() - new Date(match.userA.profile.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null,
                },
        })),
      },
    });
  } catch (error) {
    console.error('[Admire API] Error fetching admire data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
