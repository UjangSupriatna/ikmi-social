-- ================================================
-- IKMI SOCIAL - Full Database Export to MySQL
-- Generated: 2026-03-25T03:14:36.100Z
-- ================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ========================================
-- TABLE: users
-- ========================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
      `id` VARCHAR(191) NOT NULL PRIMARY KEY,
      `email` VARCHAR(255) NOT NULL UNIQUE,
      `password` VARCHAR(255) NOT NULL,
      `name` VARCHAR(255) NOT NULL,
      `username` VARCHAR(191) NOT NULL UNIQUE,
      `avatar` TEXT NULL,
      `coverPhoto` TEXT NULL,
      `bio` TEXT NULL,
      `phone` VARCHAR(50) NULL,
      `address` TEXT NULL,
      `website` VARCHAR(255) NULL,
      `headline` VARCHAR(255) NULL,
      `skills` TEXT NULL,
      `birthday` DATETIME NULL,
      `gender` VARCHAR(20) NULL,
      `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `email`, `password`, `name`, `username`, `avatar`, `coverPhoto`, `bio`, `phone`, `address`, `website`, `headline`, `skills`, `birthday`, `gender`, `createdAt`, `updatedAt`) VALUES ('cmn5dxxn9000mnhq4ad8abf21', 'test@example.com', '$2b$12$myHDCYGX4sv9FY0.s8lBGOYNiLIOSH5pOPm5Kk0ZEjRPNLjgsQ15m', 'Test User', 'testuser', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-25T01:49:12.982Z', '2026-03-25T01:49:12.982Z');

-- ========================================
-- TABLE: posts
-- ========================================
DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts` (
      `id` VARCHAR(191) NOT NULL PRIMARY KEY,
      `content` TEXT NOT NULL,
      `images` TEXT NULL,
      `location` VARCHAR(255) NULL,
      `visibility` VARCHAR(50) NOT NULL DEFAULT 'public',
      `groupId` VARCHAR(191) NULL,
      `authorId` VARCHAR(191) NOT NULL,
      `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX `idx_posts_authorId` (`authorId`),
      INDEX `idx_posts_groupId` (`groupId`),
      CONSTRAINT `fk_posts_author` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ========================================
-- TABLE: comments
-- ========================================
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
      `id` VARCHAR(191) NOT NULL PRIMARY KEY,
      `content` TEXT NOT NULL,
      `images` TEXT NULL,
      `postId` VARCHAR(191) NOT NULL,
      `authorId` VARCHAR(191) NOT NULL,
      `parentId` VARCHAR(191) NULL,
      `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX `idx_comments_postId` (`postId`),
      INDEX `idx_comments_authorId` (`authorId`),
      CONSTRAINT `fk_comments_post` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE CASCADE,
      CONSTRAINT `fk_comments_author` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ========================================
-- TABLE: likes
-- ========================================
DROP TABLE IF EXISTS `likes`;
CREATE TABLE `likes` (
      `id` VARCHAR(191) NOT NULL PRIMARY KEY,
      `userId` VARCHAR(191) NOT NULL,
      `postId` VARCHAR(191) NULL,
      `commentId` VARCHAR(191) NULL,
      `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY `uk_likes_user_post` (`userId`, `postId`),
      UNIQUE KEY `uk_likes_user_comment` (`userId`, `commentId`),
      CONSTRAINT `fk_likes_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ========================================
-- TABLE: friendships
-- ========================================
DROP TABLE IF EXISTS `friendships`;
CREATE TABLE `friendships` (
      `id` VARCHAR(191) NOT NULL PRIMARY KEY,
      `userId` VARCHAR(191) NOT NULL,
      `friendId` VARCHAR(191) NOT NULL,
      `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
      `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY `uk_friendships` (`userId`, `friendId`),
      CONSTRAINT `fk_friendships_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
      CONSTRAINT `fk_friendships_friend` FOREIGN KEY (`friendId`) REFERENCES `users`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ========================================
-- TABLE: groups
-- ========================================
DROP TABLE IF EXISTS `groups`;
CREATE TABLE `groups` (
      `id` VARCHAR(191) NOT NULL PRIMARY KEY,
      `name` VARCHAR(255) NOT NULL,
      `description` TEXT NULL,
      `coverImage` TEXT NULL,
      `avatar` TEXT NULL,
      `privacy` VARCHAR(50) NOT NULL DEFAULT 'public',
      `createdById` VARCHAR(191) NOT NULL,
      `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT `fk_groups_creator` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ========================================
-- TABLE: group_members
-- ========================================
DROP TABLE IF EXISTS `group_members`;
CREATE TABLE `group_members` (
      `id` VARCHAR(191) NOT NULL PRIMARY KEY,
      `userId` VARCHAR(191) NOT NULL,
      `groupId` VARCHAR(191) NOT NULL,
      `role` VARCHAR(50) NOT NULL DEFAULT 'member',
      `joinedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY `uk_group_members` (`userId`, `groupId`),
      CONSTRAINT `fk_group_members_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
      CONSTRAINT `fk_group_members_group` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ========================================
-- TABLE: notifications
-- ========================================
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
      `id` VARCHAR(191) NOT NULL PRIMARY KEY,
      `userId` VARCHAR(191) NOT NULL,
      `type` VARCHAR(50) NOT NULL,
      `title` VARCHAR(255) NOT NULL,
      `message` TEXT NOT NULL,
      `data` TEXT NULL,
      `read` TINYINT(1) NOT NULL DEFAULT 0,
      `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX `idx_notifications_userId` (`userId`),
      CONSTRAINT `fk_notifications_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ========================================
-- TABLE: educations
-- ========================================
DROP TABLE IF EXISTS `educations`;
CREATE TABLE `educations` (
      `id` VARCHAR(191) NOT NULL PRIMARY KEY,
      `userId` VARCHAR(191) NOT NULL,
      `institution` VARCHAR(255) NOT NULL,
      `degree` VARCHAR(255) NOT NULL,
      `field` VARCHAR(255) NULL,
      `startDate` DATETIME NOT NULL,
      `endDate` DATETIME NULL,
      `description` TEXT NULL,
      `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX `idx_educations_userId` (`userId`),
      CONSTRAINT `fk_educations_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ========================================
-- TABLE: experiences
-- ========================================
DROP TABLE IF EXISTS `experiences`;
CREATE TABLE `experiences` (
      `id` VARCHAR(191) NOT NULL PRIMARY KEY,
      `userId` VARCHAR(191) NOT NULL,
      `company` VARCHAR(255) NOT NULL,
      `position` VARCHAR(255) NOT NULL,
      `location` VARCHAR(255) NULL,
      `startDate` DATETIME NOT NULL,
      `endDate` DATETIME NULL,
      `current` TINYINT(1) NOT NULL DEFAULT 0,
      `description` TEXT NULL,
      `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX `idx_experiences_userId` (`userId`),
      CONSTRAINT `fk_experiences_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ========================================
-- TABLE: achievements
-- ========================================
DROP TABLE IF EXISTS `achievements`;
CREATE TABLE `achievements` (
      `id` VARCHAR(191) NOT NULL PRIMARY KEY,
      `userId` VARCHAR(191) NOT NULL,
      `title` VARCHAR(255) NOT NULL,
      `description` TEXT NULL,
      `date` DATETIME NULL,
      `issuer` VARCHAR(255) NULL,
      `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX `idx_achievements_userId` (`userId`),
      CONSTRAINT `fk_achievements_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ========================================
-- TABLE: portfolios
-- ========================================
DROP TABLE IF EXISTS `portfolios`;
CREATE TABLE `portfolios` (
      `id` VARCHAR(191) NOT NULL PRIMARY KEY,
      `userId` VARCHAR(191) NOT NULL,
      `title` VARCHAR(255) NOT NULL,
      `description` TEXT NULL,
      `link` VARCHAR(500) NULL,
      `images` TEXT NULL,
      `technologies` TEXT NULL,
      `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX `idx_portfolios_userId` (`userId`),
      CONSTRAINT `fk_portfolios_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ========================================
-- TABLE: conversations
-- ========================================
DROP TABLE IF EXISTS `conversations`;
CREATE TABLE `conversations` (
      `id` VARCHAR(191) NOT NULL PRIMARY KEY,
      `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ========================================
-- TABLE: conversation_participants
-- ========================================
DROP TABLE IF EXISTS `conversation_participants`;
CREATE TABLE `conversation_participants` (
      `id` VARCHAR(191) NOT NULL PRIMARY KEY,
      `conversationId` VARCHAR(191) NOT NULL,
      `userId` VARCHAR(191) NOT NULL,
      `joinedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `lastReadAt` DATETIME NULL,
      UNIQUE KEY `uk_conv_participants` (`userId`, `conversationId`),
      INDEX `idx_conv_participants_conv` (`conversationId`),
      INDEX `idx_conv_participants_user` (`userId`),
      CONSTRAINT `fk_conv_participants_conv` FOREIGN KEY (`conversationId`) REFERENCES `conversations`(`id`) ON DELETE CASCADE,
      CONSTRAINT `fk_conv_participants_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ========================================
-- TABLE: messages
-- ========================================
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
      `id` VARCHAR(191) NOT NULL PRIMARY KEY,
      `conversationId` VARCHAR(191) NOT NULL,
      `senderId` VARCHAR(191) NOT NULL,
      `content` TEXT NOT NULL,
      `images` TEXT NULL,
      `read` TINYINT(1) NOT NULL DEFAULT 0,
      `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX `idx_messages_conv` (`conversationId`),
      INDEX `idx_messages_sender` (`senderId`),
      CONSTRAINT `fk_messages_conv` FOREIGN KEY (`conversationId`) REFERENCES `conversations`(`id`) ON DELETE CASCADE,
      CONSTRAINT `fk_messages_sender` FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ========================================
-- TABLE: events
-- ========================================
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
      `id` VARCHAR(191) NOT NULL PRIMARY KEY,
      `title` VARCHAR(255) NOT NULL,
      `description` TEXT NULL,
      `image` TEXT NULL,
      `startDate` DATETIME NOT NULL,
      `endDate` DATETIME NULL,
      `location` VARCHAR(255) NULL,
      `locationType` VARCHAR(50) NOT NULL DEFAULT 'offline',
      `onlineUrl` VARCHAR(500) NULL,
      `category` VARCHAR(50) NOT NULL DEFAULT 'seminar',
      `maxAttendees` INT NULL,
      `isFree` TINYINT(1) NOT NULL DEFAULT 1,
      `price` VARCHAR(100) NULL,
      `status` VARCHAR(50) NOT NULL DEFAULT 'upcoming',
      `createdById` VARCHAR(191) NOT NULL,
      `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX `idx_events_creator` (`createdById`),
      INDEX `idx_events_startDate` (`startDate`),
      INDEX `idx_events_category` (`category`),
      CONSTRAINT `fk_events_creator` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `events` VALUES ('cmn5eme1e0001nh0mt3wn4168', 'Seminar AI 2025', 'Seminar tentang AI', NULL, '2025-06-15T09:00:00.000Z', NULL, 'Aula IKMI', 'offline', NULL, 'seminar', NULL, 1, NULL, 'upcoming', 'cmn5dxxn9000mnhq4ad8abf21', '2026-03-25T02:08:13.971Z', '2026-03-25T02:08:13.971Z');
INSERT INTO `events` VALUES ('cmn5eok220001nh3p1qpl5ac7', 'Workshop Web Development', 'Workshop praktis membuat website modern dengan React dan Next.js', NULL, '2025-07-20T13:00:00.000Z', '2025-07-20T17:00:00.000Z', 'Lab Komputer IKMI', 'offline', NULL, 'workshop', 30, 1, NULL, 'upcoming', 'cmn5dxxn9000mnhq4ad8abf21', '2026-03-25T02:09:55.082Z', '2026-03-25T02:09:55.082Z');
INSERT INTO `events` VALUES ('cmn5eok2z0003nh3prrvmhtja', 'Webinar Karir IT', 'Webinar tentang peluang karir di industri IT bersama praktisi', NULL, '2025-08-10T19:00:00.000Z', '2025-08-10T21:00:00.000Z', NULL, 'online', 'https://zoom.us/j/123456', 'webinar', NULL, 1, NULL, 'upcoming', 'cmn5dxxn9000mnhq4ad8abf21', '2026-03-25T02:09:55.116Z', '2026-03-25T02:09:55.116Z');
INSERT INTO `events` VALUES ('cmn5eok3z0005nh3p0agrwpkc', 'Hackathon IKMI 2025', 'Kompetisi programming 24 jam untuk mahasiswa IKMI', NULL, '2025-09-05T08:00:00.000Z', '2025-09-06T08:00:00.000Z', 'Gedung Serbaguna IKMI', 'offline', NULL, 'competition', 100, 1, NULL, 'upcoming', 'cmn5dxxn9000mnhq4ad8abf21', '2026-03-25T02:09:55.151Z', '2026-03-25T02:09:55.151Z');

-- ========================================
-- TABLE: event_attendances
-- ========================================
DROP TABLE IF EXISTS `event_attendances`;
CREATE TABLE `event_attendances` (
      `id` VARCHAR(191) NOT NULL PRIMARY KEY,
      `eventId` VARCHAR(191) NOT NULL,
      `userId` VARCHAR(191) NOT NULL,
      `status` VARCHAR(50) NOT NULL DEFAULT 'interested',
      `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY `uk_event_attendances` (`userId`, `eventId`),
      INDEX `idx_event_attendances_event` (`eventId`),
      INDEX `idx_event_attendances_user` (`userId`),
      CONSTRAINT `fk_event_attendances_event` FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON DELETE CASCADE,
      CONSTRAINT `fk_event_attendances_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


SET FOREIGN_KEY_CHECKS = 1;
-- ================================================
-- END OF EXPORT
-- ================================================
