import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { createCommentNotification, createMentionNotification, createReplyNotification } from '@/lib/notifications'

// Helper function to extract @mentions from content
function extractMentions(content: string): string[] {
  const mentionRegex = /@([a-zA-Z0-9_]+)/g
  const matches = content.match(mentionRegex) || []
  // Remove @ prefix and get unique usernames
  const usernames = [...new Set(matches.map(m => m.substring(1)))]
  return usernames
}

// GET - Fetch comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser()
    const { id: postId } = await params
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Check if post exists
    const post = await db.post.findUnique({
      where: { id: postId },
      select: { id: true },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Fetch only top-level comments (no parent)
    const comments = await db.comment.findMany({
      where: {
        postId,
        parentId: null, // Only top-level comments
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
            likes: {
              select: {
                userId: true,
              },
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                    avatar: true,
                  },
                },
                likes: {
                  select: {
                    userId: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    })

    // Transform comments to include isLiked
    const transformComment = (comment: typeof comments[0]) => ({
      ...comment,
      images: comment.images ? JSON.parse(comment.images) : [],
      isLiked: currentUser 
        ? comment.likes.some((like) => like.userId === currentUser.id)
        : false,
      likeCount: comment.likes.length,
      replies: comment.replies.map((reply) => ({
        ...reply,
        images: reply.images ? JSON.parse(reply.images) : [],
        isLiked: currentUser 
          ? reply.likes.some((like) => like.userId === currentUser.id)
          : false,
        likeCount: reply.likes.length,
        replies: reply.replies.map((nestedReply) => ({
          ...nestedReply,
          images: nestedReply.images ? JSON.parse(nestedReply.images) : [],
          isLiked: currentUser 
            ? nestedReply.likes.some((like) => like.userId === currentUser.id)
            : false,
          likeCount: nestedReply.likes.length,
        })),
      })),
    })

    const transformedComments = comments.map(transformComment)

    // Get total count
    const total = await db.comment.count({
      where: {
        postId,
        parentId: null,
      },
    })

    return NextResponse.json({
      comments: transformedComments,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + limit < total,
      },
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST - Add a comment to a post
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: postId } = await params
    const body = await request.json()
    const { content, parentId, images } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      )
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'Comment content is too long (max 2000 characters)' },
        { status: 400 }
      )
    }

    // Check if post exists and get author info
    const post = await db.post.findUnique({
      where: { id: postId },
      select: { 
        id: true, 
        authorId: true,
        content: true,
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // If replying to a comment, verify parent exists and get author info
    let parentCommentAuthorId: string | null = null
    if (parentId) {
      const parentComment = await db.comment.findUnique({
        where: { id: parentId },
        select: { id: true, postId: true, authorId: true },
      })

      if (!parentComment || parentComment.postId !== postId) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        )
      }
      parentCommentAuthorId = parentComment.authorId
    }

    // Validate images
    let imageData: string[] = []
    if (images && Array.isArray(images)) {
      if (images.length > 2) {
        return NextResponse.json(
          { error: 'Maximum 2 images allowed per comment' },
          { status: 400 }
        )
      }
      imageData = images
    }

    const comment = await db.comment.create({
      data: {
        content: content.trim(),
        images: imageData.length > 0 ? JSON.stringify(imageData) : null,
        postId,
        authorId: currentUser.id,
        parentId: parentId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
    })

    // Create notifications (async, don't wait)
    ;(async () => {
      try {
        // 1. Notify post author about the comment (if not commenting on own post and not a reply)
        // For replies, we notify the parent comment author instead
        if (!parentId && post.authorId !== currentUser.id) {
          await createCommentNotification(
            post.authorId,
            currentUser.name,
            currentUser.id,
            postId,
            comment.id
          )
        }

        // 2. Notify parent comment author about the reply
        if (parentId && parentCommentAuthorId && parentCommentAuthorId !== currentUser.id) {
          await createReplyNotification(
            parentCommentAuthorId,
            currentUser.name,
            currentUser.id,
            postId,
            comment.id,
            parentId
          )
        }

        // 3. Extract @mentions and notify mentioned users
        const mentionedUsernames = extractMentions(content)
        
        if (mentionedUsernames.length > 0) {
          // Find users by username
          const mentionedUsers = await db.user.findMany({
            where: {
              username: { in: mentionedUsernames },
            },
            select: { id: true, username: true },
          })

          // Create mention notifications for each mentioned user
          for (const mentionedUser of mentionedUsers) {
            // Don't notify if user mentions themselves
            // Also don't notify parent comment author again (they already got reply notification)
            if (mentionedUser.id !== currentUser.id && mentionedUser.id !== parentCommentAuthorId) {
              await createMentionNotification(
                mentionedUser.id,
                currentUser.name,
                currentUser.id,
                postId,
                comment.id
              )
            }
          }
        }
      } catch (notificationError) {
        // Log error but don't fail the comment creation
        console.error('Error creating notifications:', notificationError)
      }
    })()

    return NextResponse.json({
      ...comment,
      images: imageData,
      isLiked: false,
      likeCount: 0,
      replies: [],
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
