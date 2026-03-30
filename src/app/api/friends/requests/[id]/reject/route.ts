import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

// POST /api/friends/requests/[id]/reject - Reject a friend request (by recipient) or Cancel a sent request (by sender)
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

    // Find the friend request
    const friendship = await db.friendship.findUnique({
      where: { id }
    })

    if (!friendship) {
      return NextResponse.json(
        { error: 'Friend request not found' },
        { status: 404 }
      )
    }

    // Check if already processed
    if (friendship.status !== 'pending') {
      return NextResponse.json(
        { error: `Friend request already ${friendship.status}` },
        { status: 400 }
      )
    }

    // Allow both recipient (friendId) to reject AND sender (userId) to cancel
    const isRecipient = friendship.friendId === currentUser.id
    const isSender = friendship.userId === currentUser.id

    if (!isRecipient && !isSender) {
      return NextResponse.json(
        { error: 'Not authorized to reject/cancel this request' },
        { status: 403 }
      )
    }

    // Delete the friend request
    await db.friendship.delete({
      where: { id }
    })

    const message = isSender 
      ? 'Friend request cancelled' 
      : 'Friend request rejected'

    return NextResponse.json({
      message,
      deleted: true,
      action: isSender ? 'cancelled' : 'rejected'
    })
  } catch (error) {
    console.error('Error rejecting/cancelling friend request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
