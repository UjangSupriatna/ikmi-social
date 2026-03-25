"use client"

import * as React from "react"
import { UserPlus, Users, TrendingUp, Calendar, Clock, ChevronRight, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

import { cn } from "@/lib/utils"
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

// Item dimensions
const ITEM_HEIGHT = 56 // p-2 (8px top + 8px bottom) + content (40px)
const ICON_SIZE = 40
const ACTION_SIZE = 32

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
        toast({ title: 'Friend request sent!' })
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

  // Loading Component
  const LoadingState = () => (
    <div className="flex justify-center py-4">
      <Loader2 className="size-5 animate-spin text-muted-foreground" />
    </div>
  )

  // Empty State Component
  const EmptyState = ({ message }: { message: string }) => (
    <p className="text-sm text-muted-foreground text-center py-4">{message}</p>
  )

  // Section Header Component
  const SectionHeader = ({ 
    icon: Icon, 
    title, 
    onViewAll, 
    hasItems 
  }: { 
    icon: React.ElementType
    title: string
    onViewAll?: () => void
    hasItems: boolean
  }) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-primary shrink-0" />
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      {hasItems && onViewAll && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2 text-xs text-primary"
          onClick={onViewAll}
        >
          View All<ChevronRight className="size-3 ml-0.5" />
        </Button>
      )}
    </div>
  )

  // Common row style for all items
  const rowStyle = "flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          
          {/* People You May Know */}
          <section>
            <SectionHeader
              icon={UserPlus}
              title="People You May Know"
              onViewAll={onViewAllPeople}
              hasItems={suggestedUsers.length > 0}
            />
            
            <div className="mt-3">
              {isLoadingUsers ? (
                <LoadingState />
              ) : suggestedUsers.length === 0 ? (
                <EmptyState message="No suggestions available" />
              ) : (
                <div className="space-y-1">
                  {suggestedUsers.slice(0, 5).map((user) => (
                    <div key={user.id} className={rowStyle}>
                      {/* Avatar */}
                      <Avatar className="size-10 shrink-0">
                        <AvatarImage src={user.avatar || undefined} alt={user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.mutualFriends > 0 
                            ? `${user.mutualFriends} mutual friends`
                            : `@${user.username}`
                          }
                        </p>
                      </div>
                      
                      {/* Action */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-8 shrink-0"
                        disabled={sendingRequestId === user.id}
                        onClick={() => handleSendRequest(user.id)}
                      >
                        {sendingRequestId === user.id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <UserPlus className="size-3.5" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <Separator />

          {/* Popular Groups */}
          <section>
            <SectionHeader
              icon={TrendingUp}
              title="Popular Groups"
              onViewAll={onViewAllGroups}
              hasItems={suggestedGroups.length > 0}
            />
            
            <div className="mt-3">
              {isLoadingGroups ? (
                <LoadingState />
              ) : suggestedGroups.length === 0 ? (
                <EmptyState message="No groups available" />
              ) : (
                <div className="space-y-1">
                  {suggestedGroups.slice(0, 5).map((group) => (
                    <div 
                      key={group.id} 
                      className={rowStyle}
                      onClick={() => onGroupClick?.(group.id)}
                    >
                      {/* Group Icon */}
                      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                        {group.avatar ? (
                          <img src={group.avatar} alt={group.name} className="size-full object-cover" />
                        ) : (
                          <Users className="size-5 text-primary" />
                        )}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {group.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {group.memberCount.toLocaleString()} members
                        </p>
                      </div>
                      
                      {/* Action */}
                      {!group.isMember && onJoinGroup && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            onJoinGroup(group.id)
                          }}
                        >
                          <UserPlus className="size-3.5" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <Separator />

          {/* Upcoming Events */}
          <section>
            <SectionHeader
              icon={Calendar}
              title="Upcoming Events"
              onViewAll={onViewAllEvents}
              hasItems={upcomingEvents.length > 0}
            />
            
            <div className="mt-3">
              {isLoadingEvents ? (
                <LoadingState />
              ) : upcomingEvents.length === 0 ? (
                <EmptyState message="No upcoming events" />
              ) : (
                <div className="space-y-1">
                  {upcomingEvents.slice(0, 5).map((event) => {
                    const eventDate = new Date(event.startDate)
                    return (
                      <div 
                        key={event.id} 
                        className={rowStyle}
                        onClick={() => onEventClick?.(event.id)}
                      >
                        {/* Date Card */}
                        <div className="size-10 rounded-lg bg-primary/10 flex flex-col items-center justify-center shrink-0">
                          <span className="text-[9px] font-medium text-muted-foreground uppercase leading-none">
                            {format(eventDate, 'MMM', { locale: id })}
                          </span>
                          <span className="text-sm font-bold text-primary leading-tight">
                            {format(eventDate, 'd')}
                          </span>
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                            {event.title}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="size-3 shrink-0" />
                            <span>{format(eventDate, 'HH:mm')}</span>
                            {event.location && (
                              <>
                                <span className="mx-0.5">·</span>
                                <span className="truncate">{event.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </section>

          <Separator />

          {/* Quick Links */}
          <div className="text-xs text-muted-foreground">
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              <span className="hover:text-foreground transition-colors cursor-pointer">About</span>
              <span>·</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">Help Center</span>
              <span>·</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">Privacy</span>
              <span>·</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">Terms</span>
            </div>
            <p className="mt-2">© 2024 IKMI SOCIAL</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
