import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { unlink } from 'fs/promises'
import path from 'path'

// Helper to delete image files from filesystem
async function deleteImageFiles(imageUrls: string[]) {
  for (const url of imageUrls) {
    // Only delete local uploads (not external URLs)
    if (url.startsWith('/uploads/')) {
      try {
        const filepath = path.join(process.cwd(), 'public', url)
        await unlink(filepath)
        console.log('Deleted image:', url)
      } catch (error) {
        console.error('Failed to delete image:', url, error)
      }
    }
  }
}

// GET - Fetch a single post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser()
    const { id } = await params

    const post = await db.post.findUnique({
      where: { id },
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
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if user can view this post
    if (post.visibility !== 'public' && post.authorId !== currentUser?.id) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Safely parse images
    let parsedImages: string[] = []
    if (post.images) {
      try {
        const parsed = JSON.parse(post.images)
        parsedImages = Array.isArray(parsed) ? parsed : []
      } catch {
        parsedImages = []
      }
    }

    return NextResponse.json({
      ...post,
      images: parsedImages,
      isLiked: currentUser 
        ? post.likes.some((like) => like.userId === currentUser.id)
        : false,
      likeCount: post._count.likes,
      commentCount: post._count.comments,
    })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a post and its images
export async function DELETE(
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

    const { id } = await params

    const post = await db.post.findUnique({
      where: { id },
      select: { 
        authorId: true, 
        images: true,
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
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if user is the author or group admin/moderator
    const isAuthor = post.authorId === currentUser.id
    const isGroupAdmin = post.group?.members && post.group.members.length > 0

    if (!isAuthor && !isGroupAdmin) {
      return NextResponse.json(
        { error: 'You can only delete your own posts' },
        { status: 403 }
      )
    }

    // Parse images before deleting
    let imageUrls: string[] = []
    if (post.images) {
      try {
        const parsed = JSON.parse(post.images)
        imageUrls = Array.isArray(parsed) ? parsed : []
      } catch {
        imageUrls = []
      }
    }

    // Delete associated likes and comments in correct order to handle foreign key constraints
    // 1. First delete all comment likes (likes on comments)
    const comments = await db.comment.findMany({
      where: { postId: id },
      select: { id: true },
    })
    const commentIds = comments.map(c => c.id)

    if (commentIds.length > 0) {
      await db.like.deleteMany({
        where: { commentId: { in: commentIds } },
      })
    }

    // 2. Delete all likes on the post
    await db.like.deleteMany({
      where: { postId: id },
    })

    // 3. Delete all comments - handle nested replies by setting parentId to null first
    // This breaks the self-referencing foreign key constraint
    await db.comment.updateMany({
      where: { postId: id },
      data: { parentId: null },
    })
    
    // Now we can safely delete all comments
    await db.comment.deleteMany({
      where: { postId: id },
    })

    // 4. Delete the post from database
    await db.post.delete({
      where: { id },
    })

    // Delete image files from filesystem
    if (imageUrls.length > 0) {
      await deleteImageFiles(imageUrls)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
