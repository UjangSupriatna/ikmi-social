import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// GET - List all groups (both public and private visible to everyone)
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit
    const search = searchParams.get('search') || ''

    const whereClause = search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {}

    // Get all groups - both public and private
    const groups = await db.group.findMany({
      where: whereClause,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
        ...(currentUser && {
          members: {
            where: { userId: currentUser.id },
            select: { role: true },
          },
        }),
        ...(currentUser && {
          joinRequests: {
            where: { 
              userId: currentUser.id,
              status: 'pending'
            },
            select: { id: true },
          },
        }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    })

    // Transform groups
    const transformedGroups = groups.map((group) => {
      const isMember = currentUser ? (group.members as { role: string }[]).length > 0 : false
      const hasPendingRequest = currentUser ? (group.joinRequests as { id: string }[]).length > 0 : false
      
      return {
        id: group.id,
        name: group.name,
        description: group.description,
        coverImage: group.coverImage,
        avatar: group.avatar,
        privacy: group.privacy,
        createdBy: group.createdBy,
        memberCount: group._count.members,
        postCount: group._count.posts,
        isMember,
        memberRole: currentUser && (group.members as { role: string }[]).length > 0 ? (group.members as { role: string }[])[0].role : null,
        isCreator: currentUser ? group.createdById === currentUser.id : false,
        hasPendingRequest,
        createdAt: group.createdAt,
      }
    })

    // Get total count
    const total = await db.group.count({
      where: whereClause,
    })

    return NextResponse.json({
      groups: transformedGroups,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + limit < total,
      },
    })
  } catch (error) {
    console.error('Error fetching groups:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data grup' },
      { status: 500 }
    )
  }
}

// POST - Create a new group
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Tidak diizinkan' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, coverImage, avatar, privacy = 'public' } = body

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nama grup wajib diisi' },
        { status: 400 }
      )
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: 'Nama grup terlalu panjang (maksimal 100 karakter)' },
        { status: 400 }
      )
    }

    if (description && description.length > 500) {
      return NextResponse.json(
        { error: 'Deskripsi terlalu panjang (maksimal 500 karakter)' },
        { status: 400 }
      )
    }

    // Create group and add creator as admin member
    const group = await db.group.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        coverImage,
        avatar,
        privacy,
        createdById: currentUser.id,
        members: {
          create: {
            userId: currentUser.id,
            role: 'admin',
          },
        },
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
    })

    return NextResponse.json({
      id: group.id,
      name: group.name,
      description: group.description,
      coverImage: group.coverImage,
      avatar: group.avatar,
      privacy: group.privacy,
      createdBy: group.createdBy,
      memberCount: group._count.members,
      postCount: group._count.posts,
      isMember: true,
      memberRole: 'admin',
      isCreator: true,
      createdAt: group.createdAt,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating group:', error)
    return NextResponse.json(
      { error: 'Gagal membuat grup' },
      { status: 500 }
    )
  }
}
