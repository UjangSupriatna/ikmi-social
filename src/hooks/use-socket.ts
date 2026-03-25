'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface UseSocketOptions {
  userId?: string
  onNewMessage?: (message: any) => void
  onNotification?: (notification: any) => void
  onUserTyping?: (data: { conversationId: string; userId: string; userName: string }) => void
  onUserStopTyping?: (data: { conversationId: string; userId: string }) => void
  onMessagesRead?: (data: { conversationId: string; readBy: string }) => void
  onMessageSent?: (message: any) => void
}

export function useSocket({
  userId,
  onNewMessage,
  onNotification,
  onUserTyping,
  onUserStopTyping,
  onMessagesRead,
  onMessageSent,
}: UseSocketOptions) {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Connect to the chat service through the gateway
    socketRef.current = io('/?XTransformPort=3003', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    const socket = socketRef.current

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id)
      setIsConnected(true)
      
      // Join with userId if available
      if (userId) {
        socket.emit('join', userId)
      }
    })

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected')
      setIsConnected(false)
    })

    socket.on('joined', (data: { userId: string; conversations: string[] }) => {
      console.log('[Socket] Joined as user:', data.userId, 'Conversations:', data.conversations.length)
    })

    socket.on('new-message', (message: any) => {
      console.log('[Socket] New message received:', message)
      onNewMessage?.(message)
    })

    socket.on('message-sent', (message: any) => {
      console.log('[Socket] Message sent confirmation:', message)
      onMessageSent?.(message)
    })

    socket.on('notification', (notification: any) => {
      console.log('[Socket] Notification:', notification)
      onNotification?.(notification)
    })

    socket.on('user-typing', (data: any) => {
      onUserTyping?.(data)
    })

    socket.on('user-stop-typing', (data: any) => {
      onUserStopTyping?.(data)
    })

    socket.on('messages-read', (data: any) => {
      onMessagesRead?.(data)
    })

    socket.on('error', (error: any) => {
      console.error('[Socket] Error:', error)
    })

    return () => {
      socket.disconnect()
    }
  }, [userId]) // Reconnect when userId changes

  const joinConversation = useCallback((conversationId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('join-conversation', conversationId)
    }
  }, [isConnected])

  const leaveConversation = useCallback((conversationId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('leave-conversation', conversationId)
    }
  }, [isConnected])

  const sendMessage = useCallback((data: {
    conversationId: string
    senderId: string
    content: string
    images?: string[]
  }) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('send-message', data)
    }
  }, [isConnected])

  const emitTyping = useCallback((conversationId: string, userId: string, userName: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing', { conversationId, userId, userName })
    }
  }, [isConnected])

  const emitStopTyping = useCallback((conversationId: string, userId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('stop-typing', { conversationId, userId })
    }
  }, [isConnected])

  const markAsRead = useCallback((conversationId: string, userId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('mark-read', { conversationId, userId })
    }
  }, [isConnected])

  return {
    isConnected,
    joinConversation,
    leaveConversation,
    sendMessage,
    emitTyping,
    emitStopTyping,
    markAsRead,
  }
}
