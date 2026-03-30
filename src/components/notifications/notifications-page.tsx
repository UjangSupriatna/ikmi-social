'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, CheckCheck, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  NotificationItem, 
  NotificationItemType 
} from './notification-item'

interface NotificationsPageProps {
  onNotificationClick?: () => void
}

export function NotificationsPage({ onNotificationClick }: NotificationsPageProps) {
  const [notifications, setNotifications] = React.useState<NotificationItemType[]>([])
  const [unreadCount, setUnreadCount] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isMarkingAllRead, setIsMarkingAllRead] = React.useState(false)

  const fetchNotifications = React.useCallback(async () => {
    try {
      const response = await fetch('/api/notifications?limit=50')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchNotifications()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PUT',
      })
      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, read: true } : n))
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    setIsMarkingAllRead(true)
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
      })
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    } finally {
      setIsMarkingAllRead(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-3 sm:p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
            <Bell className="size-4 sm:size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold">Notifikasi</h2>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {unreadCount > 0 ? `${unreadCount} belum dibaca` : 'Semua sudah dibaca'}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAllRead}
          >
            {isMarkingAllRead ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <CheckCheck className="size-3.5" />
            )}
            <span className="hidden sm:inline">Tandai semua dibaca</span>
            <span className="sm:hidden">Tandai dibaca</span>
          </Button>
        )}
      </div>

      {/* Content */}
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="size-12 text-muted-foreground/30 mb-4" />
            <p className="text-sm font-medium text-muted-foreground">Belum ada notifikasi</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Kami akan memberi tahu saat ada sesuatu
            </p>
          </div>
        ) : (
          <CardContent className="p-0 divide-y">
            <AnimatePresence>
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <NotificationItem
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onClose={onNotificationClick}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
