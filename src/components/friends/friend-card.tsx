'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AddFriendButton, FriendshipStatus } from './add-friend-button'
import { useNavigationStore } from '@/stores/navigation-store'
import { cn, getImageUrl } from '@/lib/utils'

export interface FriendCardUser {
  id: string
  name: string
  username: string
  avatar: string | null
  headline?: string | null
  mutualFriendsCount?: number
}

interface FriendCardProps {
  user: FriendCardUser
  friendshipStatus: FriendshipStatus
  requestId?: string
  onAddFriend?: () => Promise<void>
  onAcceptFriend?: () => Promise<void>
  onRejectFriend?: () => Promise<void>
  onUnfriend?: () => Promise<void>
  onCancelRequest?: () => Promise<void>
  showMutualFriends?: boolean
  compact?: boolean // Compact mode for grid display
  className?: string
}

export function FriendCard({
  user,
  friendshipStatus,
  requestId,
  onAddFriend,
  onAcceptFriend,
  onRejectFriend,
  onUnfriend,
  onCancelRequest,
  showMutualFriends = true,
  compact = false,
  className
}: FriendCardProps) {
  const [currentStatus, setCurrentStatus] = useState<FriendshipStatus>(friendshipStatus)
  const { navigate } = useNavigationStore()

  const handleAddFriend = async () => {
    if (onAddFriend) {
      await onAddFriend()
      setCurrentStatus('pending_sent')
    }
  }

  const handleAcceptFriend = async () => {
    if (onAcceptFriend) {
      await onAcceptFriend()
      setCurrentStatus('friends')
    }
  }

  const handleRejectFriend = async () => {
    if (onRejectFriend) {
      await onRejectFriend()
      setCurrentStatus('none')
    }
  }

  const handleUnfriend = async () => {
    if (onUnfriend) {
      await onUnfriend()
      setCurrentStatus('none')
    }
  }

  const handleCancelRequest = async () => {
    if (onCancelRequest) {
      await onCancelRequest()
      setCurrentStatus('none')
    }
  }

  const handleViewProfile = () => {
    navigate({ type: 'profile', userId: user.id })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Compact mode for grid display in friends list
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={cn("shadow-none border-0 bg-transparent", className)}>
          <CardContent className="p-1">
            <div className="flex flex-col items-center text-center gap-1">
              {/* Avatar */}
              <button onClick={handleViewProfile} className="focus:outline-none">
                <Avatar className="size-10 sm:size-12 border border-primary/20">
                  <AvatarImage src={getImageUrl(user.avatar) || undefined} alt={user.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-[9px] sm:text-[10px]">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </button>

              {/* User Info */}
              <div className="min-w-0 w-full">
                <button 
                  onClick={handleViewProfile}
                  className="focus:outline-none w-full"
                >
                  <h3 className="font-medium text-[9px] sm:text-[10px] text-foreground truncate">
                    {user.name}
                  </h3>
                </button>
                <p className="text-[8px] sm:text-[9px] text-muted-foreground truncate">@{user.username}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Full card mode with action buttons
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("shadow-sm hover:shadow-md transition-shadow", className)}>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <button onClick={handleViewProfile} className="focus:outline-none flex-shrink-0">
              <Avatar className="size-12 sm:size-14 border border-primary/20">
                <AvatarImage src={getImageUrl(user.avatar) || undefined} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </button>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <button 
                onClick={handleViewProfile}
                className="focus:outline-none text-left w-full"
              >
                <h3 className="font-medium text-sm text-foreground truncate hover:text-primary transition-colors">
                  {user.name}
                </h3>
              </button>
              <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
              {user.headline && (
                <p className="text-xs text-muted-foreground/70 truncate mt-0.5">{user.headline}</p>
              )}
              {showMutualFriends && user.mutualFriendsCount !== undefined && user.mutualFriendsCount > 0 && (
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Users className="size-3" />
                  <span>{user.mutualFriendsCount} teman bersama</span>
                </div>
              )}
            </div>

            {/* Action Button */}
            <AddFriendButton
              friendshipStatus={currentStatus}
              requestId={requestId}
              onAddFriend={handleAddFriend}
              onAcceptFriend={handleAcceptFriend}
              onRejectFriend={handleRejectFriend}
              onUnfriend={handleUnfriend}
              onCancelRequest={handleCancelRequest}
              size="sm"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
