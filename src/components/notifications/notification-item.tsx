'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  UserPlus, 
  Heart, 
  MessageCircle, 
  Users, 
  AtSign,
  Check,
  X,
  Loader2,
  Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useNavigationStore } from '@/stores/navigation-store'

export type NotificationType = 
  | 'friend_request'
  | 'friend_accepted'
  | 'like'
  | 'comment'
  | 'group_invite'
  | 'mention'

export interface NotificationItemData {
  fromUserId?: string
  postId?: string
  commentId?: string
  groupId?: string
  friendshipId?: string
}

export interface NotificationItemType {
  id: string
  type: NotificationType
  title: string
  message: string
  data: NotificationItemData | null
  read: boolean
  createdAt: string | Date
  // Optional actor info for display
  actor?: {
    id: string
    name: string
    username: string
    avatar: string | null
  }
}

export interface NotificationItemProps {
  notification: NotificationItemType
  onMarkAsRead?: (id: string) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onClose?: () => void
  className?: string
}

const notificationIcons: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  friend_request: UserPlus,
  friend_accepted: UserPlus,
  like: Heart,
  comment: MessageCircle,
  group_invite: Users,
  mention: AtSign,
}

const notificationColors: Record<NotificationType, string> = {
  friend_request: 'bg-blue-500',
  friend_accepted: 'bg-teal-500',
  like: 'bg-red-500',
  comment: 'bg-purple-500',
  group_invite: 'bg-amber-500',
  mention: 'bg-cyan-500',
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  onClose,
  className,
}: NotificationItemProps) {
  const [isLoading, setIsLoading] = useState<'read' | 'delete' | null>(null)
  const [isRemoved, setIsRemoved] = useState(false)
  const { navigate } = useNavigationStore()

  const Icon = notificationIcons[notification.type] || Bell
  const iconBgColor = notificationColors[notification.type] || 'bg-gray-500'

  const handleMarkAsRead = async () => {
    if (!onMarkAsRead || notification.read) return
    setIsLoading('read')
    try {
      await onMarkAsRead(notification.id)
    } catch (error) {
      console.error('Failed to mark as read:', error)
    } finally {
      setIsLoading(null)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return
    setIsLoading('delete')
    try {
      await onDelete(notification.id)
      setIsRemoved(true)
    } catch (error) {
      console.error('Failed to delete notification:', error)
    } finally {
      setIsLoading(null)
    }
  }

  const handleClick = async () => {
    // Mark as read
    await handleMarkAsRead()
    
    // Navigate based on notification type
    const { data } = notification
    if (!data) return

    switch (notification.type) {
      case 'friend_request':
        // Navigate to friends page with requests tab active
        navigate({ type: 'friends', tab: 'requests' })
        break
      case 'friend_accepted':
        if (data.fromUserId) {
          navigate({ type: 'profile', userId: data.fromUserId })
        } else {
          navigate({ type: 'friends' })
        }
        break
      case 'like':
      case 'comment':
      case 'mention':
        if (data.postId) {
          navigate({ type: 'post', postId: data.postId })
        }
        break
      case 'group_invite':
        if (data.groupId) {
          navigate({ type: 'groups', groupId: data.groupId })
        } else {
          navigate({ type: 'groups' })
        }
        break
    }

    // Close the dropdown
    onClose?.()
  }

  const getTimeAgo = (date: string | Date) => {
    const now = new Date()
    const then = new Date(date)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return then.toLocaleDateString()
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isRemoved) {
    return (
      <motion.div
        initial={{ opacity: 1, height: 'auto' }}
        animate={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="p-4 text-sm text-muted-foreground text-center">
          Notification removed
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative group',
        className
      )}
    >
      <button 
        onClick={handleClick}
        className={cn(
          'flex items-start gap-3 p-4 hover:bg-accent/50 transition-colors w-full text-left',
          !notification.read && 'bg-primary/5'
        )}
      >
        {/* Icon */}
        <div className={cn(
          'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
          iconBgColor
        )}>
          <Icon className="w-5 h-5 text-white" />
        </div>

        {/* Actor Avatar if available */}
        {notification.actor && (
          <Avatar className="size-10 flex-shrink-0">
            <AvatarImage src={notification.actor.avatar || undefined} alt={notification.actor.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {getInitials(notification.actor.name)}
            </AvatarFallback>
          </Avatar>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={cn(
            'text-sm font-medium',
            !notification.read && 'text-foreground',
            notification.read && 'text-muted-foreground'
          )}>
            {notification.title}
          </p>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            {getTimeAgo(notification.createdAt)}
          </p>
        </div>

        {/* Unread indicator */}
        {!notification.read && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2">
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
        )}
      </button>

      {/* Action buttons (shown on hover) */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        {!notification.read && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleMarkAsRead()
            }}
            disabled={isLoading !== null}
          >
            {isLoading === 'read' ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Check className="w-3 h-3 text-teal-600" />
            )}
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleDelete()
            }}
            disabled={isLoading !== null}
          >
            {isLoading === 'delete' ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <X className="w-3 h-3 text-red-500" />
            )}
          </Button>
        )}
      </div>
    </motion.div>
  )
}
