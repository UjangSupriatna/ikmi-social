'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Search, UserX, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FriendCard, FriendCardUser } from './friend-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'

interface Friend extends FriendCardUser {
  friendId: string
  friendsSince: Date | string
}

interface FriendsListProps {
  className?: string
}

export function FriendsList({ className }: FriendsListProps) {
  const [friends, setFriends] = useState<Friend[]>([])
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unfriendingId, setUnfriendingId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchFriends()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFriends(friends)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredFriends(
        friends.filter(
          friend =>
            friend.name.toLowerCase().includes(query) ||
            friend.username.toLowerCase().includes(query)
        )
      )
    }
  }, [searchQuery, friends])

  const fetchFriends = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/friends')
      if (!response.ok) {
        throw new Error('Failed to fetch friends')
      }
      const data = await response.json()
      setFriends(data.friends)
      setFilteredFriends(data.friends)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnfriend = async (friendId: string) => {
    try {
      setUnfriendingId(friendId)
      const response = await fetch(`/api/friends/${friendId}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error('Failed to unfriend')
      }
      // Remove from local state
      setFriends(prev => prev.filter(f => f.friendId !== friendId))
      toast({
        title: 'Teman dihapus',
        description: 'Teman berhasil dihapus dari daftar pertemanan'
      })
    } catch (err) {
      console.error('Unfriend error:', err)
      toast({
        title: 'Error',
        description: 'Gagal menghapus teman',
        variant: 'destructive'
      })
      throw err
    } finally {
      setUnfriendingId(null)
    }
  }

  const renderLoading = () => (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
          <Skeleton className="size-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  )

  const renderEmpty = () => (
    <Card className="border-dashed">
      <CardContent className="p-8 text-center">
        <Users className="size-12 text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="font-semibold text-muted-foreground mb-2">Belum ada teman</h3>
        <p className="text-sm text-muted-foreground/70">
          Mulai terhubung dengan orang lain untuk membangun jaringan Anda
        </p>
      </CardContent>
    </Card>
  )

  const renderNoResults = () => (
    <Card className="border-dashed">
      <CardContent className="p-8 text-center">
        <Search className="size-12 text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="font-semibold text-muted-foreground mb-2">Tidak ditemukan</h3>
        <p className="text-sm text-muted-foreground/70">
          Tidak ada teman yang cocok dengan "{searchQuery}"
        </p>
      </CardContent>
    </Card>
  )

  return (
    <div className={className}>
      {/* Header with Search */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Users className="size-4 sm:size-5 text-primary" />
          <h2 className="text-base sm:text-xl font-semibold text-foreground">
            Teman
            {!isLoading && (
              <span className="text-xs sm:text-sm font-normal text-muted-foreground ml-1 sm:ml-2">
                ({friends.length})
              </span>
            )}
          </h2>
        </div>
        
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Cari teman..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 h-9 sm:h-10 text-sm"
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        renderLoading()
      ) : error ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <p className="text-red-600 text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={fetchFriends}
            >
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      ) : friends.length === 0 ? (
        renderEmpty()
      ) : filteredFriends.length === 0 ? (
        renderNoResults()
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filteredFriends.map(friend => (
              <FriendCard
                key={friend.friendId}
                user={{
                  ...friend,
                  id: friend.friendId // Use friendId as the actual user ID for navigation
                }}
                friendshipStatus="friends"
                onUnfriend={() => handleUnfriend(friend.friendId)}
                showMutualFriends={false}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
