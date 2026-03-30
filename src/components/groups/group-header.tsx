'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Lock, 
  Globe, 
  Settings, 
  UserPlus, 
  UserCheck,
  Share2,
  MoreHorizontal,
  Trash2,
  Edit,
  Loader2,
  Clock,
  UserPlus2,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { getImageUrl } from '@/lib/utils'

export interface GroupHeaderData {
  id: string
  name: string
  description: string | null
  coverImage: string | null
  avatar: string | null
  privacy: string
  memberCount: number
  postCount: number
  isMember: boolean
  memberRole: string | null
  isCreator: boolean
  isAdmin?: boolean
  hasPendingRequest?: boolean
  canViewFullContent?: boolean
  createdBy: {
    id: string
    name: string
    username: string
    avatar: string | null
  }
  createdAt: Date | string
}

interface GroupHeaderProps {
  group: GroupHeaderData
  onJoin?: () => void
  onLeave?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onShare?: () => void
  isJoiningOrLeaving?: boolean
  isDeleting?: boolean
}

export function GroupHeader({
  group,
  onJoin,
  onLeave,
  onEdit,
  onDelete,
  onShare,
  isJoiningOrLeaving = false,
  isDeleting = false,
}: GroupHeaderProps) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatTimestamp = (date: Date | string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true })
    } catch {
      return 'Unknown'
    }
  }

  const handleDelete = () => {
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    onDelete?.()
    setShowDeleteDialog(false)
  }

  const isAdmin = group.memberRole === 'admin' || group.isCreator || group.isAdmin

  // Render join button based on group type and user status
  const renderJoinButton = () => {
    if (group.isCreator) return null

    if (group.isMember) {
      return (
        <Button
          variant="outline"
          onClick={onLeave}
          disabled={isJoiningOrLeaving}
          className="gap-2"
        >
          {isJoiningOrLeaving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <UserCheck className="size-4" />
              <span className="hidden sm:inline">Keluar</span>
            </>
          )}
        </Button>
      )
    }

    // Private group - show request button
    if (group.privacy === 'private') {
      if (group.hasPendingRequest) {
        return (
          <Button variant="outline" disabled className="gap-2">
            <Clock className="size-4" />
            <span className="hidden sm:inline">Menunggu Persetujuan</span>
          </Button>
        )
      }

      return (
        <Button
          variant="default"
          onClick={onJoin}
          disabled={isJoiningOrLeaving}
          className="gap-2"
        >
          {isJoiningOrLeaving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <UserPlus2 className="size-4" />
              <span className="hidden sm:inline">Minta Bergabung</span>
            </>
          )}
        </Button>
      )
    }

    // Public group - join directly
    return (
      <Button
        variant="default"
        onClick={onJoin}
        disabled={isJoiningOrLeaving}
        className="gap-2"
      >
        {isJoiningOrLeaving ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            <UserPlus className="size-4" />
            <span className="hidden sm:inline">Gabung Group</span>
          </>
        )}
      </Button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Cover Image */}
      <div className="relative h-32 sm:h-48 md:h-64 bg-gradient-to-r from-primary/20 to-primary/10">
        {getImageUrl(group.coverImage) ? (
          <img
            src={getImageUrl(group.coverImage)!}
            alt={group.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/30 to-primary/15" />
        )}

        {/* Privacy Badge */}
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="gap-1">
            {group.privacy === 'private' ? (
              <>
                <Lock className="size-3" />
                Group Private
              </>
            ) : (
              <>
                <Globe className="size-3" />
                Group Publik
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Group Info */}
      <div className="px-4 md:px-6 py-4 border-b border-border">
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          {/* Avatar */}
          <Avatar className="size-20 sm:size-24 border-4 border-background shadow-lg -mt-12 sm:-mt-14">
            <AvatarImage src={getImageUrl(group.avatar) || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xl">
              {getInitials(group.name)}
            </AvatarFallback>
          </Avatar>

          {/* Info and Actions */}
          <div className="flex-1 min-w-0 pt-2 sm:pt-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              {/* Title and Stats */}
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold truncate">{group.name}</h1>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <span>Dibuat oleh {group.createdBy.name}</span>
                  <span>·</span>
                  <span>{formatTimestamp(group.createdAt)}</span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="size-4" />
                    <span>{group.memberCount.toLocaleString()} anggota</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span>{group.postCount.toLocaleString()} post</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {renderJoinButton()}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={onShare}
                  className="shrink-0"
                  title="Bagikan link group"
                >
                  <Share2 className="size-4" />
                </Button>

                {isAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="shrink-0">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {group.isCreator && (
                        <DropdownMenuItem onClick={onEdit}>
                          <Edit className="size-4 mr-2" />
                          Edit Group
                        </DropdownMenuItem>
                      )}
                      {group.isCreator && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={handleDelete}
                          >
                            <Trash2 className="size-4 mr-2" />
                            Hapus Group
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            {/* Description */}
            {group.description && (
              <p className="mt-4 text-sm text-muted-foreground">
                {group.description}
              </p>
            )}

            {/* Private group notice for non-members */}
            {group.privacy === 'private' && !group.isMember && (
              <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  <Lock className="size-3 inline mr-1" />
                  Ini adalah group private. Anda perlu bergabung untuk melihat postingan dan anggota.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Group</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus &quot;{group.name}&quot;? Group dan semua post akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                'Hapus'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
