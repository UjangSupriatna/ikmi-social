"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Home, Users, MessageCircle, Calendar, Bell, MoreHorizontal, Sparkles, Info, HelpCircle, Shield, FileText, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface MobileNavItem {
  title: string
  view: string
  icon: React.ComponentType<{ className?: string }>
  isAI?: boolean
}

const mobileNavItems: MobileNavItem[] = [
  {
    title: "Beranda",
    view: "feed",
    icon: Home,
  },
  {
    title: "Teman",
    view: "friends",
    icon: Users,
  },
  {
    title: "AI Asisten",
    view: "ai-assistant",
    icon: Sparkles,
    isAI: true,
  },
  {
    title: "Pesan",
    view: "messages",
    icon: MessageCircle,
  },
]

interface UserProfile {
  id: string
  name: string
  username: string
  avatar: string | null
}

interface MobileNavProps {
  className?: string
  user?: UserProfile | null
  currentView?: string
  onNavigate?: (view: string) => void
  unreadMessagesCount?: number
  unreadNotificationsCount?: number
}

// Animated Sparkles Icon Component
function AnimatedSparkles({ className }: { className?: string }) {
  return (
    <motion.div
      animate={{
        rotate: [0, 10, -10, 10, 0],
        scale: [1, 1.1, 1, 1.1, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Sparkles className={className} />
    </motion.div>
  )
}

export function MobileNav({ 
  className,
  user,
  currentView = 'feed',
  onNavigate,
  unreadMessagesCount = 0,
  unreadNotificationsCount = 0
}: MobileNavProps) {
  const handleNavClick = (view: string) => {
    if (onNavigate) {
      onNavigate(view)
    }
  }

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 md:hidden",
        "bg-background/95 backdrop-blur-md border-t border-border",
        "pb-safe-area-inset-bottom",
        className
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {mobileNavItems.map((item) => {
          const isActive = currentView === item.view
          const Icon = item.icon
          const isMessages = item.view === 'messages'
          const isAI = item.isAI

          return (
            <button
              key={item.view}
              onClick={() => handleNavClick(item.view)}
              className="flex-1 flex flex-col items-center justify-center py-2 relative"
            >
              <div className="relative">
                {isAI ? (
                  <AnimatedSparkles
                    className={cn(
                      "size-5 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                ) : (
                  <Icon
                    className={cn(
                      "size-5 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                )}
                {/* Unread badge for messages */}
                {isMessages && unreadMessagesCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-3.5 h-3.5 px-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                  </span>
                )}
              </div>
              {isActive && (
                <motion.div
                  layoutId="activeMobileNav"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          )
        })}

        {/* More Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex-1 flex flex-col items-center justify-center py-2 relative">
              <div className="relative">
                <MoreHorizontal
                  className={cn(
                    "size-5 transition-colors",
                    currentView === 'settings' || currentView === 'profile' || currentView === 'groups' ||
                    currentView === 'events' || currentView === 'notifications' ||
                    currentView === 'about' || currentView === 'help' || currentView === 'privacy' || currentView === 'terms'
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                />
                {/* Notification badge on More */}
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-3.5 h-3.5 px-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </span>
                )}
              </div>
              {(currentView === 'settings' || currentView === 'profile' || currentView === 'groups' ||
                currentView === 'events' || currentView === 'notifications' ||
                currentView === 'about' || currentView === 'help' || currentView === 'privacy' || currentView === 'terms') && (
                <motion.div
                  layoutId="activeMobileNavMore"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 mb-2">
            <DropdownMenuItem onClick={() => handleNavClick('profile')}>
              <Users className="size-4 mr-2" />
              Profil Saya
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavClick('groups')}>
              <Users className="size-4 mr-2" />
              Grup
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavClick('events')}>
              <Calendar className="size-4 mr-2" />
              Event
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavClick('notifications')}>
              <Bell className="size-4 mr-2" />
              Notifikasi
              {unreadNotificationsCount > 0 && (
                <span className="ml-auto min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">Informasi</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleNavClick('about')}>
                <Info className="size-4 mr-2" />
                Tentang
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavClick('help')}>
                <HelpCircle className="size-4 mr-2" />
                Pusat Bantuan
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavClick('privacy')}>
                <Shield className="size-4 mr-2" />
                Privasi
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavClick('terms')}>
                <FileText className="size-4 mr-2" />
                Ketentuan
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNavClick('settings')} className="text-destructive">
              <Settings className="size-4 mr-2" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
