import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// GET - Get group details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser()
    const { id } = await params

    const group = await db.group.findUnique({
      where: { id },
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
            select: { id: true, status: true },
          },
        }),
      },
    })

    if (!group) {
      return NextResponse.json(
        { error: 'Group tidak ditemukan' },
        { status: 404 }
      )
    }

    // For private groups, allow viewing basic info but mark as limited access
    const isMember = currentUser ? (group.members as { role: string }[]).length > 0 : false
    const isCreator = currentUser ? group.createdById === currentUser.id : false
    const memberRole = currentUser && (group.members as { role: string }[]).length > 0 
      ? (group.members as { role: string }[])[0].role 
      : null
    const isAdmin = isMember && ['admin', 'moderator'].includes(memberRole || '')
    const canViewFullContent = group.privacy === 'public' || isMember
    const hasPendingRequest = currentUser 
      ? (group.joinRequests as { id: string }[]).length > 0 
      : false

    // Get pending request count for admins
    let pendingRequestCount = 0
    if (group.privacy === 'private' && (isCreator || isAdmin)) {
      pendingRequestCount = await db.groupJoinRequest.count({
        where: { groupId: id, status: 'pending' }
      })
    }

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
      isMember,
      memberRole,
      isCreator,
      isAdmin,
      createdAt: group.createdAt,
      canViewFullContent, // Flag to show if user can see posts
      hasPendingRequest, // Flag for pending join request
      pendingRequestCount, // Count for admin to show badge
    })
  } catch (error) {
    console.error('Error fetching group:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data group' },
      { status: 500 }
    )
  }
}

// PUT - Update group (only creator or admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Tidak diizinkan' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { name, description, coverImage, avatar, privacy } = body

    // Check if group exists and user has permission
    const group = await db.group.findUnique({
      where: { id },
      include: {
        members: {
          where: { userId: currentUser.id },
          select: { role: true },
        },
      },
    })

    if (!group) {
      return NextResponse.json(
        { error: 'Group tidak ditemukan' },
        { status: 404 }
      )
    }

    // Only creator or admin can update
    const isCreator = group.createdById === currentUser.id
    const isAdmin = group.members.length > 0 && ['admin', 'moderator'].includes(group.members[0].role)

    if (!isCreator && !isAdmin) {
      return NextResponse.json(
        { error: 'Anda tidak memiliki izin untuk mengupdate group ini' },
        { status: 403 }
      )
    }

    // Validate input
    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        return NextResponse.json(
          { error: 'Nama group tidak boleh kosong' },
          { status: 400 }
        )
      }
      if (name.length > 100) {
        return NextResponse.json(
          { error: 'Nama group terlalu panjang (maksimal 100 karakter)' },
          { status: 400 }
        )
      }
    }

    if (description !== undefined && description && description.length > 500) {
      return NextResponse.json(
        { error: 'Deskripsi terlalu panjang (maksimal 500 karakter)' },
        { status: 400 }
      )
    }

    // Update group
    const updatedGroup = await db.group.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(coverImage !== undefined && { coverImage }),
        ...(avatar !== undefined && { avatar }),
        ...(privacy !== undefined && { privacy }),
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
        members: {
          where: { userId: currentUser.id },
          select: { role: true },
        },
      },
    })

    return NextResponse.json({
      id: updatedGroup.id,
      name: updatedGroup.name,
      description: updatedGroup.description,
      coverImage: updatedGroup.coverImage,
      avatar: updatedGroup.avatar,
      privacy: updatedGroup.privacy,
      createdBy: updatedGroup.createdBy,
      memberCount: updatedGroup._count.members,
      postCount: updatedGroup._count.posts,
      isMember: true,
      memberRole: updatedGroup.members[0]?.role || null,
      isCreator: updatedGroup.createdById === currentUser.id,
      createdAt: updatedGroup.createdAt,
    })
  } catch (error) {
    console.error('Error updating group:', error)
    return NextResponse.json(
      { error: 'Gagal mengupdate group' },
      { status: 500 }
    )
  }
}

// DELETE - Delete group (only creator)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Tidak diizinkan' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if group exists and user is the creator
    const group = await db.group.findUnique({
      where: { id },
      select: { createdById: true, name: true },
    })

    if (!group) {
      return NextResponse.json(
        { error: 'Group tidak ditemukan' },
        { status: 404 }
      )
    }

    if (group.createdById !== currentUser.id) {
      return NextResponse.json(
        { error: 'Hanya pembuat group yang dapat menghapus group ini' },
        { status: 403 }
      )
    }

    // Delete group (cascade will handle members and posts)
    await db.group.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Group berhasil dihapus' })
  } catch (error) {
    console.error('Error deleting group:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus group' },
      { status: 500 }
    )
  }
}
