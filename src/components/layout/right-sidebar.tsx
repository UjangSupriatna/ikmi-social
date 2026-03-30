"use client"

import * as React from "react"
import { UserPlus, Users, TrendingUp, Calendar, Clock, ChevronRight, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

import { cn, getImageUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

interface SuggestedUser {
  id: string
  name: string
  username: string
  avatar: string | null
  headline: string | null
  mutualFriends: number
  friendshipStatus: {
    status: string
    isSender: boolean
  } | null
}

interface SuggestedGroup {
  id: string
  name: string
  description: string | null
  avatar: string | null
  memberCount: number
  isMember: boolean
}

interface UpcomingEvent {
  id: string
  title: string
  startDate: string | Date
  location: string | null
  locationType: string
  category: string
}

interface RightSidebarProps {
  className?: string
  onGroupClick?: (groupId: string) => void
  onJoinGroup?: (groupId: string) => void
  onEventClick?: (eventId: string) => void
  onViewAllPeople?: () => void
  onViewAllGroups?: () => void
  onViewAllEvents?: () => void
}

export function RightSidebar({ 
  className, 
  onGroupClick, 
  onJoinGroup, 
  onEventClick,
  onViewAllPeople,
  onViewAllGroups,
  onViewAllEvents
}: RightSidebarProps) {
  const [suggestedUsers, setSuggestedUsers] = React.useState<SuggestedUser[]>([])
  const [suggestedGroups, setSuggestedGroups] = React.useState<SuggestedGroup[]>([])
  const [upcomingEvents, setUpcomingEvents] = React.useState<UpcomingEvent[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = React.useState(true)
  const [isLoadingGroups, setIsLoadingGroups] = React.useState(true)
  const [isLoadingEvents, setIsLoadingEvents] = React.useState(true)
  const [sendingRequestId, setSendingRequestId] = React.useState<string | null>(null)
  const { toast } = useToast()

  React.useEffect(() => {
    fetchSuggestions()
    fetchGroups()
    fetchEvents()
  }, [])

  const fetchSuggestions = async () => {
    try {
      setIsLoadingUsers(true)
      const response = await fetch('/api/friends/suggestions?limit=5')
      if (response.ok) {
        const data = await response.json()
        setSuggestedUsers(data.suggestions || [])
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error)
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const fetchGroups = async () => {
    try {
      setIsLoadingGroups(true)
      const response = await fetch('/api/groups?limit=5')
      if (response.ok) {
        const data = await response.json()
        setSuggestedGroups(data.groups || [])
      }
    } catch (error) {
      console.error('Failed to fetch groups:', error)
    } finally {
      setIsLoadingGroups(false)
    }
  }

  const fetchEvents = async () => {
    try {
      setIsLoadingEvents(true)
      const response = await fetch('/api/events?status=upcoming&limit=5')
      if (response.ok) {
        const data = await response.json()
        setUpcomingEvents(data.events || [])
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setIsLoadingEvents(false)
    }
  }

  const handleSendRequest = async (userId: string) => {
    setSendingRequestId(userId)
    try {
      const response = await fetch('/api/friends/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendId: userId }),
      })

      if (response.ok) {
        toast({ title: 'Permintaan pertemanan terkirim!' })
        setSuggestedUsers(prev => prev.filter(u => u.id !== userId))
      } else {
        const error = await response.json()
        toast({ title: 'Error', description: error.error || 'Failed to send request', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to send friend request', variant: 'destructive' })
    } finally {
      setSendingRequestId(null)
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          
          {/* People You May Know */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="size-4 text-primary" />
                <span className="text-sm font-semibold">Orang yang Mungkin Anda Kenal</span>
              </div>
              {suggestedUsers.length > 0 && onViewAllPeople && (
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-primary" onClick={onViewAllPeople}>
                  Lihat Semua<ChevronRight className="size-3 ml-0.5" />
                </Button>
              )}
            </div>
            
            {isLoadingUsers ? (
              <div className="flex justify-center py-4"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>
            ) : suggestedUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Tidak ada saran</p>
            ) : (
              <div className="space-y-2">
                {suggestedUsers.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group">
                    <Avatar className="size-10 shrink-0">
                      <AvatarImage src={getImageUrl(user.avatar) || undefined} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-primary">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.mutualFriends > 0 ? `${user.mutualFriends} teman bersama` : `@${user.username}`}</p>
                    </div>
                    <Button variant="outline" size="icon" className="size-8 shrink-0" disabled={sendingRequestId === user.id} onClick={() => handleSendRequest(user.id)}>
                      {sendingRequestId === user.id ? <Loader2 className="size-3.5 animate-spin" /> : <UserPlus className="size-3.5" />}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Popular Groups */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" />
                <span className="text-sm font-semibold">Grup Populer</span>
              </div>
              {suggestedGroups.length > 0 && onViewAllGroups && (
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-primary" onClick={onViewAllGroups}>
                  Lihat Semua<ChevronRight className="size-3 ml-0.5" />
                </Button>
              )}
            </div>
            
            {isLoadingGroups ? (
              <div className="flex justify-center py-4"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>
            ) : suggestedGroups.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Tidak ada grup</p>
            ) : (
              <div className="space-y-2">
                {suggestedGroups.slice(0, 5).map((group) => (
                  <div key={group.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group" onClick={() => onGroupClick?.(group.id)}>
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {getImageUrl(group.avatar) ? <img src={getImageUrl(group.avatar)!} alt={group.name} className="size-full object-cover" /> : <Users className="size-5 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-primary">{group.name}</p>
                      <p className="text-xs text-muted-foreground">{group.memberCount.toLocaleString()} anggota</p>
                    </div>
                    {!group.isMember && onJoinGroup && (
                      <Button variant="outline" size="icon" className="size-8 shrink-0" onClick={(e) => { e.stopPropagation(); onJoinGroup(group.id) }}>
                        <UserPlus className="size-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Upcoming Events */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                <span className="text-sm font-semibold">Event Mendatang</span>
              </div>
              {upcomingEvents.length > 0 && onViewAllEvents && (
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-primary" onClick={onViewAllEvents}>
                  Lihat Semua<ChevronRight className="size-3 ml-0.5" />
                </Button>
              )}
            </div>
            
            {isLoadingEvents ? (
              <div className="flex justify-center py-4"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>
            ) : upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Tidak ada event mendatang</p>
            ) : (
              <div className="space-y-2">
                {upcomingEvents.slice(0, 5).map((event) => {
                  const eventDate = new Date(event.startDate)
                  return (
                    <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group" onClick={() => onEventClick?.(event.id)}>
                      <div className="size-10 rounded-lg bg-primary/10 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[9px] font-medium text-muted-foreground uppercase leading-none">{format(eventDate, 'MMM', { locale: id })}</span>
                        <span className="text-sm font-bold text-primary leading-tight">{format(eventDate, 'd')}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary">{event.title}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3 shrink-0" />
                          <span>{format(eventDate, 'HH:mm')}</span>
                          {event.location && <><span className="mx-0.5">·</span><span className="truncate">{event.location}</span></>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
