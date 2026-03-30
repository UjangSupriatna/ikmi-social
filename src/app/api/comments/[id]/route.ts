import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

// Helper function to recursively get all reply IDs
async function getAllReplyIds(commentId: string): Promise<string[]> {
  const replies = await db.comment.findMany({
    where: { parentId: commentId },
    select: { id: true },
  })

  const replyIds = replies.map(r => r.id)

  // Recursively get nested replies
  for (const replyId of replyIds) {
    const nestedIds = await getAllReplyIds(replyId)
    replyIds.push(...nestedIds)
  }

  return replyIds
}

// Helper to delete notifications related to comments
async function deleteCommentNotifications(commentIds: string[]) {
  try {
    // Get all notifications that reference these comments
    const notifications = await db.notification.findMany({
      where: {
        OR: commentIds.map(id => ({
          data: { contains: id }
        }))
      },
      select: { id: true, data: true },
    })

    // Filter to only those that actually contain the commentId
    const toDelete = notifications.filter(n => {
      try {
        const data = n.data ? JSON.parse(n.data) : {}
        return commentIds.includes(data.commentId) || commentIds.includes(data.parentCommentId)
      } catch {
        return false
      }
    })

    // Delete the filtered notifications
    if (toDelete.length > 0) {
      await db.notification.deleteMany({
        where: {
          id: { in: toDelete.map(n => n.id) }
        }
      })
    }
  } catch (error) {
    console.error('Error deleting comment notifications:', error)
    // Don't throw - notifications deletion is not critical
  }
}

// DELETE /api/comments/[id] - Delete a comment
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Find the comment with author and post info
    const comment = await db.comment.findUnique({
      where: { id },
      select: {
        id: true,
        authorId: true,
        postId: true,
        post: {
          select: {
            authorId: true,
            groupId: true,
            group: {
              select: {
                members: {
                  where: {
                    userId: currentUser.id,
                    role: { in: ['admin', 'moderator'] }
                  }
                }
              }
            }
          }
        }
      },
    })

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    // Check permissions:
    // 1. Comment author can delete their own comment
    // 2. Post author can delete comments on their post (for personal posts)
    // 3. Group admin/moderator can delete comments in their group
    const isCommentAuthor = comment.authorId === currentUser.id
    const isPostAuthor = comment.post?.authorId === currentUser.id
    const isGroupAdmin = comment.post?.group?.members && comment.post.group.members.length > 0

    if (!isCommentAuthor && !isPostAuthor && !isGroupAdmin) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this comment' },
        { status: 403 }
      )
    }

    // Get all reply IDs recursively (including nested replies)
    const allReplyIds = await getAllReplyIds(id)
    const allCommentIds = [id, ...allReplyIds]

    // Delete in transaction: likes first, then replies from deepest to shallowest, then the main comment
    await db.$transaction(async (tx) => {
      // Delete all likes for the comment and all its replies
      await tx.like.deleteMany({
        where: {
          commentId: { in: allCommentIds }
        }
      })

      // Delete all replies first (from deepest to shallowest - reverse order)
      // Create a copy before reversing to avoid mutation issues
      const reversedReplyIds = [...allReplyIds].reverse()
      for (const replyId of reversedReplyIds) {
        await tx.comment.delete({
          where: { id: replyId },
        })
      }

      // Finally delete the main comment
      await tx.comment.delete({
        where: { id },
      })
    })

    // Delete related notifications (outside transaction, non-critical)
    await deleteCommentNotifications(allCommentIds)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}
