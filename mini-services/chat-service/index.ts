import { createServer } from 'http'
import { Server } from 'socket.io'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

// Store user socket connections
const userSockets = new Map<string, Set<string>>() // userId -> Set of socketIds
const socketUser = new Map<string, string>() // socketId -> userId

io.on('connection', (socket) => {
  console.log(`[Chat] Client connected: ${socket.id}`)

  // User joins with their userId
  socket.on('join', async (userId: string) => {
    try {
      console.log(`[Chat] User ${userId} joined with socket ${socket.id}`)
      
      // Store the mapping
      socketUser.set(socket.id, userId)
      
      if (!userSockets.has(userId)) {
        userSockets.set(userId, new Set())
      }
      userSockets.get(userId)!.add(socket.id)
      
      // Get user's conversations and join those rooms
      const participations = await prisma.conversationParticipant.findMany({
        where: { userId },
        select: { conversationId: true }
      })
      
      participations.forEach(({ conversationId }) => {
        socket.join(`conversation:${conversationId}`)
      })
      
      socket.emit('joined', { userId, conversations: participations.map(p => p.conversationId) })
    } catch (error) {
      console.error('[Chat] Error in join:', error)
    }
  })

  // Join a specific conversation room
  socket.on('join-conversation', (conversationId: string) => {
    socket.join(`conversation:${conversationId}`)
    console.log(`[Chat] Socket ${socket.id} joined conversation ${conversationId}`)
  })

  // Leave a conversation room
  socket.on('leave-conversation', (conversationId: string) => {
    socket.leave(`conversation:${conversationId}`)
    console.log(`[Chat] Socket ${socket.id} left conversation ${conversationId}`)
  })

  // Handle new message
  socket.on('send-message', async (data: {
    conversationId: string
    senderId: string
    content: string
    images?: string[]
  }) => {
    try {
      const { conversationId, senderId, content, images } = data
      
      // Create message in database
      const message = await prisma.message.create({
        data: {
          conversationId,
          senderId,
          content,
          images: images && images.length > 0 ? JSON.stringify(images) : null,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            }
          }
        }
      })

      // Update conversation's updatedAt
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() }
      })

      // Format message for sending
      const formattedMessage = {
        id: message.id,
        content: message.content,
        images: message.images ? JSON.parse(message.images) : [],
        sender: message.sender,
        createdAt: message.createdAt.toISOString(),
        read: message.read,
        isOwn: false, // Will be set by receiver
        conversationId
      }

      // Broadcast to all users in the conversation room (except sender)
      socket.to(`conversation:${conversationId}`).emit('new-message', formattedMessage)
      
      // Also send back to sender with isOwn: true
      socket.emit('message-sent', {
        ...formattedMessage,
        isOwn: true
      })

      // Get all participants to send notification
      const participants = await prisma.conversationParticipant.findMany({
        where: { conversationId },
        select: { userId: true }
      })

      // Send notification to offline participants (or all participants)
      participants.forEach(({ userId }) => {
        if (userId !== senderId) {
          const sockets = userSockets.get(userId)
          if (sockets) {
            sockets.forEach(socketId => {
              io.to(socketId).emit('notification', {
                type: 'new-message',
                conversationId,
                senderId,
                senderName: message.sender.name,
                preview: content.substring(0, 50)
              })
            })
          }
        }
      })

      console.log(`[Chat] Message sent in conversation ${conversationId} by ${senderId}`)
    } catch (error) {
      console.error('[Chat] Error sending message:', error)
      socket.emit('error', { message: 'Failed to send message' })
    }
  })

  // Handle typing indicator
  socket.on('typing', (data: { conversationId: string, userId: string, userName: string }) => {
    socket.to(`conversation:${data.conversationId}`).emit('user-typing', {
      conversationId: data.conversationId,
      userId: data.userId,
      userName: data.userName
    })
  })

  socket.on('stop-typing', (data: { conversationId: string, userId: string }) => {
    socket.to(`conversation:${data.conversationId}`).emit('user-stop-typing', {
      conversationId: data.conversationId,
      userId: data.userId
    })
  })

  // Handle read receipts
  socket.on('mark-read', async (data: { conversationId: string, userId: string }) => {
    try {
      const { conversationId, userId } = data
      
      await prisma.message.updateMany({
        where: {
          conversationId,
          senderId: { not: userId },
          read: false
        },
        data: { read: true }
      })

      // Update participant's lastReadAt
      await prisma.conversationParticipant.update({
        where: {
          userId_conversationId: {
            userId,
            conversationId
          }
        },
        data: { lastReadAt: new Date() }
      })

      // Notify other participants that messages were read
      socket.to(`conversation:${conversationId}`).emit('messages-read', {
        conversationId,
        readBy: userId
      })
    } catch (error) {
      console.error('[Chat] Error marking messages as read:', error)
    }
  })

  // Handle disconnect
  socket.on('disconnect', () => {
    const userId = socketUser.get(socket.id)
    if (userId) {
      const sockets = userSockets.get(userId)
      if (sockets) {
        sockets.delete(socket.id)
        if (sockets.size === 0) {
          userSockets.delete(userId)
        }
      }
      socketUser.delete(socket.id)
      console.log(`[Chat] User ${userId} disconnected (socket ${socket.id})`)
    } else {
      console.log(`[Chat] Client disconnected: ${socket.id}`)
    }
  })
})

const PORT = 3003
httpServer.listen(PORT, () => {
  console.log(`[Chat Service] Running on port ${PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[Chat Service] SIGTERM received, shutting down...')
  await prisma.$disconnect()
  httpServer.close(() => {
    console.log('[Chat Service] HTTP server closed')
    process.exit(0)
  })
})
