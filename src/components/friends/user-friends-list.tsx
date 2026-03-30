'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useNavigationStore } from '@/stores/navigation-store'
import { getImageUrl } from '@/lib/utils'

interface UserFriend {
  id: string
  friendId: string
  name: string
  username: string
  avatar: string | null
  headline: string | null
}

interface UserFriendsListProps {
  userId: string
  className?: string
}

export function UserFriendsList({ userId, className }: UserFriendsListProps) {
  const [friends, setFriends] = useState<UserFriend[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { navigate } = useNavigationStore()

  useEffect(() => {
    fetchFriends()
  }, [userId])

  const fetchFriends = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/friends?userId=${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch friends')
      }
      const data = await response.json()
      setFriends(data.friends || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleUserClick = (friendId: string) => {
    navigate({ type: 'profile', userId: friendId })
  }

  if (isLoading) {
    return (
      <div className={className}>
        <div className="grid grid-cols-4 gap-1 sm:gap-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-1 p-1">
              <Skeleton className="size-10 sm:size-12 rounded-full" />
              <div className="w-full space-y-0.5">
                <Skeleton className="h-2 w-8 sm:w-10 mx-auto" />
                <Skeleton className="h-1.5 w-6 sm:w-8 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-4 sm:p-6 text-center">
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (friends.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-4 sm:p-6 text-center">
          <Users className="size-10 sm:size-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Belum ada teman</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Users className="size-4 sm:size-5 text-primary" />
        <span className="text-sm sm:text-base font-medium">{friends.length} Teman</span>
      </div>
      <div className="grid grid-cols-4 gap-1 sm:gap-2">
        <AnimatePresence>
          {friends.map((friend, index) => (
            <motion.div
              key={friend.friendId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <div 
                className="cursor-pointer hover:bg-muted/50 rounded-lg p-1 transition-colors"
                onClick={() => handleUserClick(friend.friendId)}
              >
                <div className="flex flex-col items-center text-center gap-1">
                  <Avatar className="size-10 sm:size-12 border border-primary/20">
                    <AvatarImage src={getImageUrl(friend.avatar) || undefined} alt={friend.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-[9px] sm:text-[10px] font-medium">
                      {getInitials(friend.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 w-full">
                    <p className="font-medium text-[9px] sm:text-[10px] text-foreground truncate">
                      {friend.name}
                    </p>
                    <p className="text-[8px] sm:text-[9px] text-muted-foreground truncate">
                      @{friend.username}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
