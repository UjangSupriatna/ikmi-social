'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Check, CheckCheck } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  id: string
  content: string
  images?: string[]
  sender: {
    id: string
    name: string
    username?: string
    avatar: string | null
  }
  createdAt: Date
  read?: boolean
  isOwn: boolean
  showAvatar?: boolean
}

export function MessageBubble({
  content,
  images = [],
  sender,
  createdAt,
  read = false,
  isOwn,
  showAvatar = true,
}: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    const d = new Date(date)
    return d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex gap-1.5 sm:gap-2 max-w-[90%] sm:max-w-[75%]',
        isOwn ? 'ml-auto flex-row-reverse' : 'mr-auto'
      )}
    >
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <Avatar className="size-6 sm:size-8 shrink-0 mt-0.5">
          <AvatarImage src={sender.avatar || undefined} alt={sender.name} />
          <AvatarFallback className="bg-primary/10 text-primary text-[10px] sm:text-xs font-medium">
            {getInitials(sender.name)}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Content */}
      <div className={cn('flex flex-col gap-0.5', isOwn ? 'items-end' : 'items-start')}>
        {/* Sender name (for group chats) */}
        {!isOwn && showAvatar && (
          <span className="text-[10px] sm:text-xs text-muted-foreground ml-1">{sender.name}</span>
        )}

        {/* Bubble */}
        <div
          className={cn(
            'px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl',
            isOwn
              ? 'bg-primary text-primary-foreground rounded-br-sm sm:rounded-br-md'
              : 'bg-muted rounded-bl-sm sm:rounded-bl-md'
          )}
        >
          {/* Text content */}
          {content && (
            <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{content}</p>
          )}

          {/* Images */}
          {images && images.length > 0 && (
            <div className={cn('mt-1.5 sm:mt-2 grid gap-1', images.length > 1 && 'grid-cols-2')}>
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Image ${idx + 1}`}
                  className="rounded-lg max-h-32 sm:max-h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(img, '_blank')}
                />
              ))}
            </div>
          )}
        </div>

        {/* Time and read status */}
        <div className={cn('flex items-center gap-0.5 px-1', isOwn && 'flex-row-reverse')}>
          <span className="text-[9px] sm:text-[10px] text-muted-foreground">
            {formatTime(createdAt)}
          </span>
          {isOwn && (
            <span className="text-muted-foreground">
              {read ? (
                <CheckCheck className="size-2.5 sm:size-3 text-primary" />
              ) : (
                <Check className="size-2.5 sm:size-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
