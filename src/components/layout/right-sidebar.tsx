"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { UserPlus, Users, TrendingUp, Calendar, Clock, MapPin, ChevronRight, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

const categoryColors: Record<string, string> = {
  seminar: 'bg-blue-500/15 text-blue-500 dark:text-blue-400',
  workshop: 'bg-green-500/15 text-green-500 dark:text-green-400',
  competition: 'bg-orange-500/15 text-orange-500 dark:text-orange-400',
  gathering: 'bg-purple-500/15 text-purple-500 dark:text-purple-400',
  webinar: 'bg-cyan-500/15 text-cyan-500 dark:text-cyan-400',
  other: 'bg-gray-500/15 text-gray-500 dark:text-gray-400',
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

  const renderSectionHeader = (icon: React.ReactNode, title: string, onViewAll?: () => void, hasItems?: boolean) => (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {hasItems && onViewAll && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 px-2 text-xs text-primary hover:text-primary/80"
          onClick={onViewAll}
        >
          View All
          <ChevronRight className="size-3 ml-0.5" />
        </Button>
      )}
    </div>
  )

  const renderLoading = () => (
    <div className="flex justify-center py-4">
      <Loader2 className="size-5 animate-spin text-muted-foreground" />
    </div>
  )

  const renderEmpty = (message: string) => (
    <p className="text-sm text-muted-foreground text-center py-4">{message}</p>
  )

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* People You May Know */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {renderSectionHeader(
              <UserPlus className="size-4 text-primary" />,
              "People You May Know",
              onViewAllPeople,
              suggestedUsers.length > 0
            )}
            
            {isLoadingUsers ? renderLoading() : suggestedUsers.length === 0 ? renderEmpty("No suggestions available") : (
              <div className="space-y-2">
                {suggestedUsers.slice(0, 5).map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors group"
                  >
                    <Avatar className="size-10 shrink-0">
                      <AvatarImage src={user.avatar || undefined} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.mutualFriends > 0 
                          ? `${user.mutualFriends} mutual friends`
                          : `@${user.username}`
                        }
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="size-8 shrink-0"
                      disabled={sendingRequestId === user.id}
                      onClick={() => handleSendRequest(user.id)}
                    >
                      {sendingRequestId === user.id ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <UserPlus className="size-3.5" />
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          <Separator />

          {/* Popular Groups */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {renderSectionHeader(
              <TrendingUp className="size-4 text-primary" />,
              "Popular Groups",
              onViewAllGroups,
              suggestedGroups.length > 0
            )}
            
            {isLoadingGroups ? renderLoading() : suggestedGroups.length === 0 ? renderEmpty("No groups available") : (
              <div className="space-y-2">
                {suggestedGroups.slice(0, 5).map((group, index) => (
                  <motion.div
                    key={group.id}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.25 + index * 0.05 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors group cursor-pointer"
                    onClick={() => onGroupClick?.(group.id)}
                  >
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {group.avatar ? (
                        <img src={group.avatar} alt={group.name} className="size-full object-cover" />
                      ) : (
                        <Users className="size-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                        {group.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {group.memberCount.toLocaleString()} members
                      </p>
                    </div>
                    {!group.isMember && onJoinGroup && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="size-8 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          onJoinGroup(group.id)
                        }}
                      >
                        <UserPlus className="size-3.5" />
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          <Separator />

          {/* Upcoming Events */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            {renderSectionHeader(
              <Calendar className="size-4 text-primary" />,
              "Upcoming Events",
              onViewAllEvents,
              upcomingEvents.length > 0
            )}
            
            {isLoadingEvents ? renderLoading() : upcomingEvents.length === 0 ? renderEmpty("No upcoming events") : (
              <div className="space-y-2">
                {upcomingEvents.slice(0, 5).map((event, index) => {
                  const eventDate = new Date(event.startDate)
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors group cursor-pointer"
                      onClick={() => onEventClick?.(event.id)}
                    >
                      {/* Mini Calendar Card */}
                      <div className="flex flex-col items-center justify-center bg-primary/10 rounded-lg p-1.5 shrink-0 size-10">
                        <span className="text-[9px] font-medium text-muted-foreground uppercase leading-none">
                          {format(eventDate, 'MMM', { locale: id })}
                        </span>
                        <span className="text-sm font-bold text-primary leading-tight">
                          {format(eventDate, 'd')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                          {event.title}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3" />
                          <span>{format(eventDate, 'HH:mm')}</span>
                          {event.location && (
                            <>
                              <span className="mx-0.5">·</span>
                              <span className="truncate">{event.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>

          <Separator />

          {/* Quick Links */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-xs text-muted-foreground"
          >
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
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  )
}
