'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Trash2,
  Flag,
  Link2,
  Loader2,
  MapPin
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { useToast } from '@/hooks/use-toast'
import { CommentSection } from './comment-section'
import { useNavigationStore } from '@/stores/navigation-store'

export interface PostData {
  id: string
  content: string
  images: string[]
  location?: string | null
  visibility: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    username: string
    avatar: string | null
  }
  isLiked: boolean
  likeCount: number
  commentCount: number
}

interface PostCardProps {
  post: PostData
  currentUserId?: string
  onPostDeleted?: (postId: string) => void
  onLikeChange?: (postId: string, isLiked: boolean, likeCount: number) => void
  onCommentChange?: (postId: string, commentCount: number) => void
}

export function PostCard({ 
  post, 
  currentUserId,
  onPostDeleted,
  onLikeChange,
  onCommentChange
}: PostCardProps) {
  const [isLiked, setIsLiked] = React.useState(post.isLiked)
  const [likeCount, setLikeCount] = React.useState(post.likeCount)
  const [commentCount, setCommentCount] = React.useState(post.commentCount)
  const [showComments, setShowComments] = React.useState(false)
  const [isLiking, setIsLiking] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const { toast } = useToast()
  const { navigate } = useNavigationStore()

  const isOwnPost = currentUserId === post.author.id

  const handleViewProfile = () => {
    navigate({ type: 'profile', userId: post.author.id })
  }

  const handleLike = async () => {
    if (isLiking) return
    setIsLiking(true)

    try {
      const method = isLiked ? 'DELETE' : 'POST'
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method,
      })

      if (!response.ok) {
        throw new Error('Failed to update like')
      }

      const data = await response.json()
      setIsLiked(data.isLiked)
      setLikeCount(data.likeCount)
      onLikeChange?.(post.id, data.isLiked, data.likeCount)
    } catch (error) {
      console.error('Error updating like:', error)
      toast({
        title: 'Error',
        description: 'Failed to update like. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLiking(false)
    }
  }

  const handleDelete = async () => {
    if (isDeleting) return
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete post')
      }

      toast({
        title: 'Post deleted',
        description: 'Your post has been deleted successfully',
      })
      onPostDeleted?.(post.id)
    } catch (error) {
      console.error('Error deleting post:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete post. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleShare = async () => {
    try {
      // Use the current URL and add the post ID as a hash
      const shareUrl = `${window.location.origin}/?post=${post.id}`
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: 'Link disalin',
        description: 'Link postingan berhasil disalin ke clipboard',
      })
    } catch {
      toast({
        title: 'Error',
        description: 'Gagal menyalin link',
        variant: 'destructive',
      })
    }
  }

  const handleCommentAdded = (count: number) => {
    setCommentCount(count)
    onCommentChange?.(post.id, count)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatTimestamp = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return 'Unknown'
    }
  }

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-0 rounded-none shadow-none">
          <CardContent className="p-4">
            {/* Post Header */}
            <div className="flex items-start gap-3">
              <button onClick={handleViewProfile} className="focus:outline-none flex-shrink-0">
                <Avatar className="size-10 hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer">
                  <AvatarImage src={post.author.avatar || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {getInitials(post.author.name)}
                  </AvatarFallback>
                </Avatar>
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <button 
                    onClick={handleViewProfile}
                    className="font-semibold text-sm hover:text-primary transition-colors text-left"
                  >
                    {post.author.name}
                  </button>
                  <span className="text-muted-foreground text-xs">@{post.author.username}</span>
                  <span className="text-muted-foreground text-xs">·</span>
                  <span className="text-muted-foreground text-xs">{formatTimestamp(post.createdAt)}</span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleShare}>
                    <Link2 className="size-4 mr-2" />
                    Copy link
                  </DropdownMenuItem>
                  {isOwnPost ? (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        <Trash2 className="size-4 mr-2" />
                        Delete post
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive" disabled>
                        <Flag className="size-4 mr-2" />
                        Report post
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Post Content */}
            <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap break-words">{post.content}</p>
            
            {/* Location */}
            {post.location && (
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" />
                <span>{post.location}</span>
              </div>
            )}

            {/* Post Images */}
            {post.images && post.images.length > 0 && (
              <div className={`mt-3 grid gap-2 ${
                post.images.length === 1 ? 'grid-cols-1' :
                post.images.length === 2 ? 'grid-cols-2' :
                'grid-cols-2'
              }`}>
                {post.images.map((image, index) => (
                  <div 
                    key={index} 
                    className={`relative rounded-lg overflow-hidden bg-muted ${
                      post.images!.length === 3 && index === 0 ? 'col-span-2' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-auto max-h-[400px] object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'}`}
                onClick={handleLike}
                disabled={isLiking}
              >
                {isLiking ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Heart className={`size-4 ${isLiked ? 'fill-current' : ''}`} />
                )}
                <span className="text-xs">{likeCount}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 text-muted-foreground hover:text-primary"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="size-4" />
                <span className="text-xs">{commentCount}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 text-muted-foreground hover:text-primary"
                onClick={handleShare}
              >
                <Share2 className="size-4" />
              </Button>
            </div>

            {/* Comments Section */}
            {showComments && (
              <CommentSection
                postId={post.id}
                currentUserId={currentUserId}
                onCommentCountChange={handleCommentAdded}
              />
            )}
          </CardContent>
        </Card>
      </motion.article>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
