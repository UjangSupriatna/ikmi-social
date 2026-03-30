import { db } from '@/lib/db'

export type NotificationType = 
  | 'friend_request'
  | 'friend_accepted'
  | 'like'
  | 'comment'
  | 'group_invite'
  | 'mention'

export interface CreateNotificationData {
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, unknown>
}

export interface NotificationWithUser {
  id: string
  userId: string
  type: string
  title: string
  message: string
  data: string | null
  read: boolean
  createdAt: Date
}

/**
 * Create a notification for a user
 * @param notificationData - The notification data
 * @returns The created notification
 */
export async function createNotification(notificationData: CreateNotificationData) {
  try {
    const notification = await db.notification.create({
      data: {
        userId: notificationData.userId,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        data: notificationData.data ? JSON.stringify(notificationData.data) : null,
      },
    })

    return notification
  } catch (error) {
    console.error('Error creating notification:', error)
    throw error
  }
}

/**
 * Create a friend request notification
 */
export async function createFriendRequestNotification(
  toUserId: string,
  fromUserName: string,
  fromUserId: string,
  friendshipId: string
) {
  return createNotification({
    userId: toUserId,
    type: 'friend_request',
    title: 'Permintaan Pertemanan Baru',
    message: `${fromUserName} mengirim permintaan pertemanan`,
    data: {
      fromUserId,
      friendshipId,
    },
  })
}

/**
 * Create a friend accepted notification
 */
export async function createFriendAcceptedNotification(
  toUserId: string,
  fromUserName: string,
  fromUserId: string
) {
  return createNotification({
    userId: toUserId,
    type: 'friend_accepted',
    title: 'Permintaan Pertemanan Diterima',
    message: `${fromUserName} menerima permintaan pertemanan Anda`,
    data: {
      fromUserId,
    },
  })
}

/**
 * Create a like notification
 */
export async function createLikeNotification(
  toUserId: string,
  fromUserName: string,
  fromUserId: string,
  postId: string
) {
  // Don't notify if user likes their own post
  if (toUserId === fromUserId) return null

  return createNotification({
    userId: toUserId,
    type: 'like',
    title: 'Suka Baru',
    message: `${fromUserName} menyukai postingan Anda`,
    data: {
      fromUserId,
      postId,
    },
  })
}

/**
 * Create a comment notification
 */
export async function createCommentNotification(
  toUserId: string,
  fromUserName: string,
  fromUserId: string,
  postId: string,
  commentId: string
) {
  // Don't notify if user comments on their own post
  if (toUserId === fromUserId) return null

  return createNotification({
    userId: toUserId,
    type: 'comment',
    title: 'Komentar Baru',
    message: `${fromUserName} mengomentasi postingan Anda`,
    data: {
      fromUserId,
      postId,
      commentId,
    },
  })
}

/**
 * Create a reply notification (when someone replies to your comment)
 */
export async function createReplyNotification(
  toUserId: string,
  fromUserName: string,
  fromUserId: string,
  postId: string,
  commentId: string,
  parentCommentId: string
) {
  // Don't notify if user replies to their own comment
  if (toUserId === fromUserId) return null

  return createNotification({
    userId: toUserId,
    type: 'comment',
    title: 'Balasan Komentar',
    message: `${fromUserName} membalas komentar Anda`,
    data: {
      fromUserId,
      postId,
      commentId,
      parentCommentId,
    },
  })
}

/**
 * Create a group invite notification
 */
export async function createGroupInviteNotification(
  toUserId: string,
  fromUserName: string,
  fromUserId: string,
  groupId: string,
  groupName: string
) {
  return createNotification({
    userId: toUserId,
    type: 'group_invite',
    title: 'Undangan Grup',
    message: `${fromUserName} mengundang Anda bergabung ke ${groupName}`,
    data: {
      fromUserId,
      groupId,
    },
  })
}

/**
 * Create a mention notification
 */
export async function createMentionNotification(
  toUserId: string,
  fromUserName: string,
  fromUserId: string,
  postId: string,
  commentId?: string
) {
  // Don't notify if user mentions themselves
  if (toUserId === fromUserId) return null

  return createNotification({
    userId: toUserId,
    type: 'mention',
    title: 'Anda Disebutkan',
    message: `${fromUserName} menyebut Anda dalam ${commentId ? 'komentar' : 'postingan'}`,
    data: {
      fromUserId,
      postId,
      commentId,
    },
  })
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  try {
    const count = await db.notification.count({
      where: {
        userId,
        read: false,
      },
    })
    return count
  } catch (error) {
    console.error('Error getting unread notification count:', error)
    return 0
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string) {
  try {
    await db.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    throw error
  }
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(notificationId: string, userId: string) {
  try {
    const notification = await db.notification.update({
      where: {
        id: notificationId,
        userId, // Ensure the notification belongs to the user
      },
      data: {
        read: true,
      },
    })
    return notification
  } catch (error) {
    console.error('Error marking notification as read:', error)
    throw error
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string, userId: string) {
  try {
    await db.notification.delete({
      where: {
        id: notificationId,
        userId, // Ensure the notification belongs to the user
      },
    })
    return true
  } catch (error) {
    console.error('Error deleting notification:', error)
    throw error
  }
}
