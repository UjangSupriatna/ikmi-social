'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { UserPlus, Check, X, Loader2, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { getImageUrl } from '@/lib/utils'

interface JoinRequest {
  id: string
  message: string | null
  createdAt: Date
  user: {
    id: string
    name: string
    username: string
    avatar: string | null
    headline: string | null
  }
}

interface GroupJoinRequestsProps {
  groupId: string
  isAdmin: boolean
}

export function GroupJoinRequests({ groupId, isAdmin }: GroupJoinRequestsProps) {
  const [requests, setRequests] = React.useState<JoinRequest[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [processingId, setProcessingId] = React.useState<string | null>(null)
  const { toast } = useToast()

  const fetchRequests = React.useCallback(async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}/join-requests`)
      if (response.ok) {
        const data = await response.json()
        setRequests(data.requests)
      }
    } catch (error) {
      console.error('Failed to fetch join requests:', error)
    } finally {
      setIsLoading(false)
    }
  }, [groupId])

  React.useEffect(() => {
    if (isAdmin) {
      fetchRequests()
    }
  }, [isAdmin, fetchRequests])

  const handleAction = async (requestId: string, action: 'approve' | 'reject') => {
    setProcessingId(requestId)
    try {
      const response = await fetch(`/api/groups/${groupId}/join-requests`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: action === 'approve' ? 'Disetujui' : 'Ditolak',
          description: data.message,
        })
        setRequests(prev => prev.filter(r => r.id !== requestId))
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Gagal memproses permintaan',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal memproses permintaan',
        variant: 'destructive',
      })
    } finally {
      setProcessingId(null)
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

  if (!isAdmin) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="size-12 mx-auto text-muted-foreground/30 mb-4" />
        <p className="text-sm text-muted-foreground">Tidak ada permintaan bergabung</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {requests.map((request, index) => (
        <motion.div
          key={request.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-10 shrink-0">
                  <AvatarImage src={getImageUrl(request.user.avatar) || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {getInitials(request.user.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{request.user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    @{request.user.username}
                  </p>
                  {request.message && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      "{request.message}"
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="default"
                    className="gap-1 h-8"
                    onClick={() => handleAction(request.id, 'approve')}
                    disabled={processingId === request.id}
                  >
                    {processingId === request.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <>
                        <Check className="size-3.5" />
                        <span className="hidden sm:inline">Terima</span>
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 h-8"
                    onClick={() => handleAction(request.id, 'reject')}
                    disabled={processingId === request.id}
                  >
                    <X className="size-3.5" />
                    <span className="hidden sm:inline">Tolak</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
