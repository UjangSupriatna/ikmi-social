import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// POST - Join a group (public) or Request to join (private)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const { message } = body // Optional message for join request

    // Check if group exists
    const group = await db.group.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        privacy: true,
        createdById: true,
        members: {
          where: { userId: currentUser.id },
          select: { id: true, role: true },
        },
        joinRequests: {
          where: { 
            userId: currentUser.id,
          },
          select: { id: true, status: true },
        },
      },
    })

    if (!group) {
      return NextResponse.json(
        { error: 'Group tidak ditemukan' },
        { status: 404 }
      )
    }

    // Check if already a member
    if (group.members.length > 0) {
      return NextResponse.json(
        { error: 'Anda sudah menjadi anggota grup ini' },
        { status: 400 }
      )
    }

    // For public groups - join directly
    if (group.privacy === 'public') {
      const membership = await db.groupMember.create({
        data: {
          userId: currentUser.id,
          groupId: id,
          role: 'member',
        },
        include: {
          group: {
            select: { name: true },
          },
        },
      })

      return NextResponse.json({
        message: `Berhasil bergabung dengan ${membership.group.name}`,
        role: 'member',
        joined: true,
      }, { status: 201 })
    }

    // For private groups - create join request
    const existingRequest = group.joinRequests[0]
    
    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        return NextResponse.json(
          { error: 'Anda sudah mengirim permintaan bergabung. Menunggu persetujuan admin.' },
          { status: 400 }
        )
      }
      
      // If rejected or approved (approved but not member - edge case), update to pending
      if (existingRequest.status === 'rejected' || existingRequest.status === 'approved') {
        const joinRequest = await db.groupJoinRequest.update({
          where: { id: existingRequest.id },
          data: {
            status: 'pending',
            message: message || null,
            createdAt: new Date(), // Reset timestamp
          },
          include: {
            group: { select: { name: true } },
          },
        })

        // Create notification for group admins
        const admins = await db.groupMember.findMany({
          where: { 
            groupId: id, 
            role: { in: ['admin', 'moderator'] } 
          },
          select: { userId: true },
        })
        
        const notifyUserIds = [...new Set([...admins.map(a => a.userId), group.createdById])]
        
        await db.notification.createMany({
          data: notifyUserIds.map(adminId => ({
            userId: adminId,
            type: 'group_join_request',
            title: 'Permintaan Bergabung Grup',
            message: `${currentUser.name} ingin bergabung dengan grup ${group.name}`,
            data: JSON.stringify({ 
              groupId: id, 
              groupName: group.name,
              requestId: joinRequest.id,
              userId: currentUser.id,
              userName: currentUser.name 
            }),
          })),
        })

        return NextResponse.json({
          message: `Permintaan bergabung terkirim. Menunggu persetujuan admin.`,
          requested: true,
          status: 'pending',
        }, { status: 201 })
      }
    }

    // Create new join request
    const joinRequest = await db.groupJoinRequest.create({
      data: {
        userId: currentUser.id,
        groupId: id,
        message: message || null,
        status: 'pending',
      },
      include: {
        group: { select: { name: true } },
      },
    })

    // Create notification for group admins
    const admins = await db.groupMember.findMany({
      where: { 
        groupId: id, 
        role: { in: ['admin', 'moderator'] } 
      },
      select: { userId: true },
    })
    
    // Also notify the creator
    const notifyUserIds = [...new Set([...admins.map(a => a.userId), group.createdById])]
    
    await db.notification.createMany({
      data: notifyUserIds.map(adminId => ({
        userId: adminId,
        type: 'group_join_request',
        title: 'Permintaan Bergabung Grup',
        message: `${currentUser.name} ingin bergabung dengan grup ${group.name}`,
        data: JSON.stringify({ 
          groupId: id, 
          groupName: group.name,
          requestId: joinRequest.id,
          userId: currentUser.id,
          userName: currentUser.name 
        }),
      })),
    })

    return NextResponse.json({
      message: `Permintaan bergabung terkirim. Menunggu persetujuan admin.`,
      requested: true,
      status: 'pending',
    }, { status: 201 })
  } catch (error) {
    console.error('Error joining group:', error)
    return NextResponse.json(
      { error: 'Gagal bergabung dengan grup' },
      { status: 500 }
    )
  }
}

// DELETE - Leave a group
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if group exists and user is a member
    const group = await db.group.findUnique({
      where: { id },
      select: {
        id: true,
        createdById: true,
        name: true,
        members: {
          where: { userId: currentUser.id },
          select: { id: true, role: true },
        },
        joinRequests: {
          where: { userId: currentUser.id },
          select: { id: true },
        },
      },
    })

    if (!group) {
      return NextResponse.json(
        { error: 'Group tidak ditemukan' },
        { status: 404 }
      )
    }

    if (group.members.length === 0) {
      return NextResponse.json(
        { error: 'Anda bukan anggota grup ini' },
        { status: 400 }
      )
    }

    // Creator cannot leave their own group (must delete or transfer ownership)
    if (group.createdById === currentUser.id) {
      return NextResponse.json(
        { error: 'Pembuat grup tidak bisa keluar. Hapus grup atau alihkan kepemilikan.' },
        { status: 400 }
      )
    }

    // Remove membership
    await db.groupMember.delete({
      where: { id: group.members[0].id },
    })
    
    // Also delete any existing join request so user can rejoin later
    if (group.joinRequests.length > 0) {
      await db.groupJoinRequest.delete({
        where: { id: group.joinRequests[0].id },
      })
    }

    return NextResponse.json({
      message: `Berhasil keluar dari ${group.name}`,
    })
  } catch (error) {
    console.error('Error leaving group:', error)
    return NextResponse.json(
      { error: 'Gagal keluar dari grup' },
      { status: 500 }
    )
  }
}
