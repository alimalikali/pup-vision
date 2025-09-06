import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'
import { jwtUtils } from '@/lib/jwt'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Get current user ID from auth token
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('access-token')?.value
    
    if (!token) {
      return NextResponse.json({ success: false, message: "No authentication token" }, { status: 401 })
    }

    // Verify token
    const decoded = jwtUtils.verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
    }

    const currentUserId = decoded.userId
    const { action, photoUrl, photoIndex } = await request.json()

    if (!action) {
      return NextResponse.json({ 
        success: false, 
        message: "Action is required" 
      }, { status: 400 })
    }

    // Get current user's profile
    const user = await prisma.user.findUnique({
      where: { id: currentUserId },
      include: { profile: true }
    })

    if (!user || !user.profile) {
      return NextResponse.json({ 
        success: false, 
        message: "Profile not found" 
      }, { status: 404 })
    }

    switch (action) {
      case 'upload':
        if (!photoUrl) {
          return NextResponse.json({ 
            success: false, 
            message: "Photo URL is required for upload" 
          }, { status: 400 })
        }

        // For now, we'll store photos as an array in the avatar field
        // In a real implementation, you'd have a separate photos table
        const currentPhotos = user.profile.avatar ? [user.profile.avatar] : []
        const updatedPhotos = [...currentPhotos, photoUrl]

        await prisma.profile.update({
          where: { userId: currentUserId },
          data: {
            avatar: updatedPhotos[0], // Set first photo as main avatar
            // In a real implementation, you'd store photos in a separate table
          }
        })

        return NextResponse.json({
          success: true,
          message: "Photo uploaded successfully",
          photoUrl
        })

      case 'remove':
        if (photoIndex === undefined) {
          return NextResponse.json({ 
            success: false, 
            message: "Photo index is required for removal" 
          }, { status: 400 })
        }

        const photos = user.profile.avatar ? [user.profile.avatar] : []
        if (photoIndex < 0 || photoIndex >= photos.length) {
          return NextResponse.json({ 
            success: false, 
            message: "Invalid photo index" 
          }, { status: 400 })
        }

        photos.splice(photoIndex, 1)
        const newAvatar = photos.length > 0 ? photos[0] : null

        await prisma.profile.update({
          where: { userId: currentUserId },
          data: {
            avatar: newAvatar
          }
        })

        return NextResponse.json({
          success: true,
          message: "Photo removed successfully"
        })

      case 'setMain':
        if (photoIndex === undefined) {
          return NextResponse.json({ 
            success: false, 
            message: "Photo index is required for setting main photo" 
          }, { status: 400 })
        }

        const allPhotos = user.profile.avatar ? [user.profile.avatar] : []
        if (photoIndex < 0 || photoIndex >= allPhotos.length) {
          return NextResponse.json({ 
            success: false, 
            message: "Invalid photo index" 
          }, { status: 400 })
        }

        // Move the selected photo to the front
        const selectedPhoto = allPhotos[photoIndex]
        allPhotos.splice(photoIndex, 1)
        allPhotos.unshift(selectedPhoto)

        await prisma.profile.update({
          where: { userId: currentUserId },
          data: {
            avatar: allPhotos[0]
          }
        })

        return NextResponse.json({
          success: true,
          message: "Main photo updated successfully"
        })

      default:
        return NextResponse.json({ 
          success: false, 
          message: "Invalid action. Must be 'upload', 'remove', or 'setMain'" 
        }, { status: 400 })
    }

  } catch (error) {
    console.error("Photo upload error:", error)
    await prisma.$disconnect()
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get current user ID from auth token
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('access-token')?.value
    
    if (!token) {
      return NextResponse.json({ success: false, message: "No authentication token" }, { status: 401 })
    }

    // Verify token
    const decoded = jwtUtils.verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
    }

    const currentUserId = decoded.userId

    // Get current user's profile
    const user = await prisma.user.findUnique({
      where: { id: currentUserId },
      include: { profile: true }
    })

    if (!user || !user.profile) {
      return NextResponse.json({ 
        success: false, 
        message: "Profile not found" 
      }, { status: 404 })
    }

    // For now, return photos as an array from the avatar field
    // In a real implementation, you'd have a separate photos table
    const photos = user.profile.avatar ? [user.profile.avatar] : []

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      photos,
      total: photos.length
    })

  } catch (error) {
    console.error("Photo GET error:", error)
    await prisma.$disconnect()
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
