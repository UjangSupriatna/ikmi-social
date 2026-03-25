import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/messages/[id] - Get messages for a conversation
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: conversationId } = await params

    // Check if user is a participant
    const participation = await db.conversationParticipant.findUnique({
      where: {
        userId_conversationId: {
          userId: user.id,
          conversationId,
        },
      },
    })

    if (!participation) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get URL search params for pagination
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Get messages
    const messages = await db.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
    })

    // Get conversation info with participants
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
                headline: true,
              },
            },
          },
        },
      },
    })

    // Mark messages as read and update lastReadAt
    await db.message.updateMany({
      where: {
        conversationId,
        senderId: { not: user.id },
        read: false,
      },
      data: { read: true },
    })

    // Update participant's lastReadAt
    await db.conversationParticipant.update({
      where: {
        userId_conversationId: {
          userId: user.id,
          conversationId,
        },
      },
      data: { lastReadAt: new Date() },
    })

    // Format response
    const formattedMessages = messages.reverse().map((msg) => ({
      id: msg.id,
      content: msg.content,
      images: msg.images ? JSON.parse(msg.images) : [],
      sender: msg.sender,
      createdAt: msg.createdAt,
      read: msg.read,
      isOwn: msg.senderId === user.id,
    }))

    // Get other participants
    const otherParticipants = conversation?.participants
      .filter((p) => p.userId !== user.id)
      .map((p) => p.user) || []

    return NextResponse.json({
      messages: formattedMessages,
      conversation: {
        id: conversation?.id,
        createdAt: conversation?.createdAt,
        updatedAt: conversation?.updatedAt,
        participants: otherParticipants,
      },
      nextCursor: messages.length === limit ? messages[messages.length - 1]?.id : null,
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/messages/[id] - Send a message to conversation
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: conversationId } = await params

    // Check if user is a participant
    const participation = await db.conversationParticipant.findUnique({
      where: {
        userId_conversationId: {
          userId: user.id,
          conversationId,
        },
      },
    })

    if (!participation) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const body = await request.json()
    const { content, images } = body

    if (!content && (!images || images.length === 0)) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 })
    }

    // Create message
    const message = await db.message.create({
      data: {
        conversationId,
        senderId: user.id,
        content: content || '',
        images: images && images.length > 0 ? JSON.stringify(images) : null,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    })

    // Update conversation's updatedAt
    await db.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({
      message: {
        id: message.id,
        content: message.content,
        images: message.images ? JSON.parse(message.images) : [],
        sender: message.sender,
        createdAt: message.createdAt,
        read: message.read,
        isOwn: true,
      },
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
