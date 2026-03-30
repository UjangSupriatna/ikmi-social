import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// GET - Get pending join requests (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if user is admin or creator
    const group = await db.group.findUnique({
      where: { id },
      select: {
        createdById: true,
        members: {
          where: { userId: currentUser.id },
          select: { role: true },
        },
      },
    })

    if (!group) {
      return NextResponse.json({ error: 'Group tidak ditemukan' }, { status: 404 })
    }

    const isCreator = group.createdById === currentUser.id
    const isAdmin = group.members.length > 0 && 
      ['admin', 'moderator'].includes(group.members[0].role)

    if (!isCreator && !isAdmin) {
      return NextResponse.json({ error: 'Hanya admin yang bisa melihat permintaan' }, { status: 403 })
    }

    // Get pending requests
    const requests = await db.groupJoinRequest.findMany({
      where: { groupId: id, status: 'pending' },
      include: {
        user: {
          select: { id: true, name: true, username: true, avatar: true, headline: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ requests })
  } catch (error) {
    console.error('Error fetching join requests:', error)
    return NextResponse.json({ error: 'Gagal mengambil data permintaan' }, { status: 500 })
  }
}

// PUT - Approve or reject a join request (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { requestId, action } = body // action: 'approve' or 'reject'

    if (!requestId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Check if user is admin or creator
    const group = await db.group.findUnique({
      where: { id },
      select: {
        name: true,
        createdById: true,
        members: {
          where: { userId: currentUser.id },
          select: { role: true },
        },
      },
    })

    if (!group) {
      return NextResponse.json({ error: 'Group tidak ditemukan' }, { status: 404 })
    }

    const isCreator = group.createdById === currentUser.id
    const isAdmin = group.members.length > 0 && 
      ['admin', 'moderator'].includes(group.members[0].role)

    if (!isCreator && !isAdmin) {
      return NextResponse.json({ error: 'Hanya admin yang bisa menyetujui permintaan' }, { status: 403 })
    }

    // Get the join request
    const joinRequest = await db.groupJoinRequest.findUnique({
      where: { id: requestId },
      include: {
        user: { select: { id: true, name: true } },
      },
    })

    if (!joinRequest || joinRequest.groupId !== id) {
      return NextResponse.json({ error: 'Permintaan tidak ditemukan' }, { status: 404 })
    }

    if (joinRequest.status !== 'pending') {
      return NextResponse.json({ error: 'Permintaan sudah diproses' }, { status: 400 })
    }

    if (action === 'approve') {
      // Update request status and create membership
      await db.$transaction([
        db.groupJoinRequest.update({
          where: { id: requestId },
          data: { status: 'approved' },
        }),
        db.groupMember.create({
          data: {
            userId: joinRequest.userId,
            groupId: id,
            role: 'member',
          },
        }),
      ])

      // Notify user
      await db.notification.create({
        data: {
          userId: joinRequest.userId,
          type: 'group_join_approved',
          title: 'Permintaan Diterima',
          message: `Permintaan bergabung ke grup ${group.name} telah disetujui!`,
          data: JSON.stringify({ groupId: id, groupName: group.name }),
        },
      })

      return NextResponse.json({ message: `${joinRequest.user.name} telah bergabung dengan grup` })
    } else {
      // Reject request
      await db.groupJoinRequest.update({
        where: { id: requestId },
        data: { status: 'rejected' },
      })

      // Notify user
      await db.notification.create({
        data: {
          userId: joinRequest.userId,
          type: 'group_join_rejected',
          title: 'Permintaan Ditolak',
          message: `Permintaan bergabung ke grup ${group.name} ditolak.`,
          data: JSON.stringify({ groupId: id, groupName: group.name }),
        },
      })

      return NextResponse.json({ message: `Permintaan ${joinRequest.user.name} ditolak` })
    }
  } catch (error) {
    console.error('Error processing join request:', error)
    return NextResponse.json({ error: 'Gagal memproses permintaan' }, { status: 500 })
  }
}
