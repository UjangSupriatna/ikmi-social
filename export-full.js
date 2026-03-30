const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function escapeSQL(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function formatDate(date) {
  if (!date) return 'NULL';
  return `'${new Date(date).toISOString()}'`;
}

async function exportToMySQL() {
  let sql = '-- ================================================\n';
  sql += '-- IKMI SOCIAL - Full Database Export to MySQL\n';
  sql += '-- Generated: ' + new Date().toISOString() + '\n';
  sql += '-- ================================================\n\n';
  sql += 'SET NAMES utf8mb4;\n';
  sql += 'SET FOREIGN_KEY_CHECKS = 0;\n\n';

  try {
    // Users
    const users = await prisma.user.findMany();
    sql += '-- ========================================\n';
    sql += '-- TABLE: users\n';
    sql += '-- ========================================\n';
    sql += `DROP TABLE IF EXISTS \`users\`;\n`;
    sql += `CREATE TABLE \`users\` (
      \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
      \`email\` VARCHAR(255) NOT NULL UNIQUE,
      \`password\` VARCHAR(255) NOT NULL,
      \`name\` VARCHAR(255) NOT NULL,
      \`username\` VARCHAR(191) NOT NULL UNIQUE,
      \`avatar\` TEXT NULL,
      \`coverPhoto\` TEXT NULL,
      \`bio\` TEXT NULL,
      \`phone\` VARCHAR(50) NULL,
      \`address\` TEXT NULL,
      \`website\` VARCHAR(255) NULL,
      \`headline\` VARCHAR(255) NULL,
      \`skills\` TEXT NULL,
      \`birthday\` DATETIME NULL,
      \`gender\` VARCHAR(20) NULL,
      \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    
    for (const u of users) {
      sql += `INSERT INTO \`users\` (\`id\`, \`email\`, \`password\`, \`name\`, \`username\`, \`avatar\`, \`coverPhoto\`, \`bio\`, \`phone\`, \`address\`, \`website\`, \`headline\`, \`skills\`, \`birthday\`, \`gender\`, \`createdAt\`, \`updatedAt\`) VALUES (${escapeSQL(u.id)}, ${escapeSQL(u.email)}, ${escapeSQL(u.password)}, ${escapeSQL(u.name)}, ${escapeSQL(u.username)}, ${escapeSQL(u.avatar)}, ${escapeSQL(u.coverPhoto)}, ${escapeSQL(u.bio)}, ${escapeSQL(u.phone)}, ${escapeSQL(u.address)}, ${escapeSQL(u.website)}, ${escapeSQL(u.headline)}, ${escapeSQL(u.skills)}, ${formatDate(u.birthday)}, ${escapeSQL(u.gender)}, ${formatDate(u.createdAt)}, ${formatDate(u.updatedAt)});\n`;
    }
    sql += '\n';

    // Posts
    const posts = await prisma.post.findMany();
    sql += '-- ========================================\n';
    sql += '-- TABLE: posts\n';
    sql += '-- ========================================\n';
    sql += `DROP TABLE IF EXISTS \`posts\`;\n`;
    sql += `CREATE TABLE \`posts\` (
      \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
      \`content\` TEXT NOT NULL,
      \`images\` TEXT NULL,
      \`location\` VARCHAR(255) NULL,
      \`visibility\` VARCHAR(50) NOT NULL DEFAULT 'public',
      \`groupId\` VARCHAR(191) NULL,
      \`authorId\` VARCHAR(191) NOT NULL,
      \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX \`idx_posts_authorId\` (\`authorId\`),
      INDEX \`idx_posts_groupId\` (\`groupId\`),
      CONSTRAINT \`fk_posts_author\` FOREIGN KEY (\`authorId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    
    for (const p of posts) {
      sql += `INSERT INTO \`posts\` VALUES (${escapeSQL(p.id)}, ${escapeSQL(p.content)}, ${escapeSQL(p.images)}, ${escapeSQL(p.location)}, ${escapeSQL(p.visibility)}, ${escapeSQL(p.groupId)}, ${escapeSQL(p.authorId)}, ${formatDate(p.createdAt)}, ${formatDate(p.updatedAt)});\n`;
    }
    sql += '\n';

    // Comments
    const comments = await prisma.comment.findMany();
    sql += '-- ========================================\n';
    sql += '-- TABLE: comments\n';
    sql += '-- ========================================\n';
    sql += `DROP TABLE IF EXISTS \`comments\`;\n`;
    sql += `CREATE TABLE \`comments\` (
      \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
      \`content\` TEXT NOT NULL,
      \`images\` TEXT NULL,
      \`postId\` VARCHAR(191) NOT NULL,
      \`authorId\` VARCHAR(191) NOT NULL,
      \`parentId\` VARCHAR(191) NULL,
      \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX \`idx_comments_postId\` (\`postId\`),
      INDEX \`idx_comments_authorId\` (\`authorId\`),
      CONSTRAINT \`fk_comments_post\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE CASCADE,
      CONSTRAINT \`fk_comments_author\` FOREIGN KEY (\`authorId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    
    for (const c of comments) {
      sql += `INSERT INTO \`comments\` VALUES (${escapeSQL(c.id)}, ${escapeSQL(c.content)}, ${escapeSQL(c.images)}, ${escapeSQL(c.postId)}, ${escapeSQL(c.authorId)}, ${escapeSQL(c.parentId)}, ${formatDate(c.createdAt)}, ${formatDate(c.updatedAt)});\n`;
    }
    sql += '\n';

    // Likes
    const likes = await prisma.like.findMany();
    sql += '-- ========================================\n';
    sql += '-- TABLE: likes\n';
    sql += '-- ========================================\n';
    sql += `DROP TABLE IF EXISTS \`likes\`;\n`;
    sql += `CREATE TABLE \`likes\` (
      \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
      \`userId\` VARCHAR(191) NOT NULL,
      \`postId\` VARCHAR(191) NULL,
      \`commentId\` VARCHAR(191) NULL,
      \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY \`uk_likes_user_post\` (\`userId\`, \`postId\`),
      UNIQUE KEY \`uk_likes_user_comment\` (\`userId\`, \`commentId\`),
      CONSTRAINT \`fk_likes_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    
    for (const l of likes) {
      sql += `INSERT INTO \`likes\` VALUES (${escapeSQL(l.id)}, ${escapeSQL(l.userId)}, ${escapeSQL(l.postId)}, ${escapeSQL(l.commentId)}, ${formatDate(l.createdAt)});\n`;
    }
    sql += '\n';

    // Friendships
    const friendships = await prisma.friendship.findMany();
    sql += '-- ========================================\n';
    sql += '-- TABLE: friendships\n';
    sql += '-- ========================================\n';
    sql += `DROP TABLE IF EXISTS \`friendships\`;\n`;
    sql += `CREATE TABLE \`friendships\` (
      \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
      \`userId\` VARCHAR(191) NOT NULL,
      \`friendId\` VARCHAR(191) NOT NULL,
      \`status\` VARCHAR(50) NOT NULL DEFAULT 'pending',
      \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY \`uk_friendships\` (\`userId\`, \`friendId\`),
      CONSTRAINT \`fk_friendships_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
      CONSTRAINT \`fk_friendships_friend\` FOREIGN KEY (\`friendId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    
    for (const f of friendships) {
      sql += `INSERT INTO \`friendships\` VALUES (${escapeSQL(f.id)}, ${escapeSQL(f.userId)}, ${escapeSQL(f.friendId)}, ${escapeSQL(f.status)}, ${formatDate(f.createdAt)}, ${formatDate(f.updatedAt)});\n`;
    }
    sql += '\n';

    // Groups
    const groups = await prisma.group.findMany();
    sql += '-- ========================================\n';
    sql += '-- TABLE: groups\n';
    sql += '-- ========================================\n';
    sql += `DROP TABLE IF EXISTS \`groups\`;\n`;
    sql += `CREATE TABLE \`groups\` (
      \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
      \`name\` VARCHAR(255) NOT NULL,
      \`description\` TEXT NULL,
      \`coverImage\` TEXT NULL,
      \`avatar\` TEXT NULL,
      \`privacy\` VARCHAR(50) NOT NULL DEFAULT 'public',
      \`createdById\` VARCHAR(191) NOT NULL,
      \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT \`fk_groups_creator\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    
    for (const g of groups) {
      sql += `INSERT INTO \`groups\` VALUES (${escapeSQL(g.id)}, ${escapeSQL(g.name)}, ${escapeSQL(g.description)}, ${escapeSQL(g.coverImage)}, ${escapeSQL(g.avatar)}, ${escapeSQL(g.privacy)}, ${escapeSQL(g.createdById)}, ${formatDate(g.createdAt)}, ${formatDate(g.updatedAt)});\n`;
    }
    sql += '\n';

    // Group Members
    const groupMembers = await prisma.groupMember.findMany();
    sql += '-- ========================================\n';
    sql += '-- TABLE: group_members\n';
    sql += '-- ========================================\n';
    sql += `DROP TABLE IF EXISTS \`group_members\`;\n`;
    sql += `CREATE TABLE \`group_members\` (
      \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
      \`userId\` VARCHAR(191) NOT NULL,
      \`groupId\` VARCHAR(191) NOT NULL,
      \`role\` VARCHAR(50) NOT NULL DEFAULT 'member',
      \`joinedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY \`uk_group_members\` (\`userId\`, \`groupId\`),
      CONSTRAINT \`fk_group_members_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
      CONSTRAINT \`fk_group_members_group\` FOREIGN KEY (\`groupId\`) REFERENCES \`groups\`(\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    
    for (const gm of groupMembers) {
      sql += `INSERT INTO \`group_members\` VALUES (${escapeSQL(gm.id)}, ${escapeSQL(gm.userId)}, ${escapeSQL(gm.groupId)}, ${escapeSQL(gm.role)}, ${formatDate(gm.joinedAt)});\n`;
    }
    sql += '\n';

    // Notifications
    const notifications = await prisma.notification.findMany();
    sql += '-- ========================================\n';
    sql += '-- TABLE: notifications\n';
    sql += '-- ========================================\n';
    sql += `DROP TABLE IF EXISTS \`notifications\`;\n`;
    sql += `CREATE TABLE \`notifications\` (
      \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
      \`userId\` VARCHAR(191) NOT NULL,
      \`type\` VARCHAR(50) NOT NULL,
      \`title\` VARCHAR(255) NOT NULL,
      \`message\` TEXT NOT NULL,
      \`data\` TEXT NULL,
      \`read\` TINYINT(1) NOT NULL DEFAULT 0,
      \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX \`idx_notifications_userId\` (\`userId\`),
      CONSTRAINT \`fk_notifications_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    
    for (const n of notifications) {
      sql += `INSERT INTO \`notifications\` VALUES (${escapeSQL(n.id)}, ${escapeSQL(n.userId)}, ${escapeSQL(n.type)}, ${escapeSQL(n.title)}, ${escapeSQL(n.message)}, ${escapeSQL(n.data)}, ${n.read ? 1 : 0}, ${formatDate(n.createdAt)});\n`;
    }
    sql += '\n';

    // Education
    const educations = await prisma.education.findMany();
    sql += '-- ========================================\n';
    sql += '-- TABLE: educations\n';
    sql += '-- ========================================\n';
    sql += `DROP TABLE IF EXISTS \`educations\`;\n`;
    sql += `CREATE TABLE \`educations\` (
      \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
      \`userId\` VARCHAR(191) NOT NULL,
      \`institution\` VARCHAR(255) NOT NULL,
      \`degree\` VARCHAR(255) NOT NULL,
      \`field\` VARCHAR(255) NULL,
      \`startDate\` DATETIME NOT NULL,
      \`endDate\` DATETIME NULL,
      \`description\` TEXT NULL,
      \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX \`idx_educations_userId\` (\`userId\`),
      CONSTRAINT \`fk_educations_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    
    for (const e of educations) {
      sql += `INSERT INTO \`educations\` VALUES (${escapeSQL(e.id)}, ${escapeSQL(e.userId)}, ${escapeSQL(e.institution)}, ${escapeSQL(e.degree)}, ${escapeSQL(e.field)}, ${formatDate(e.startDate)}, ${formatDate(e.endDate)}, ${escapeSQL(e.description)}, ${formatDate(e.createdAt)}, ${formatDate(e.updatedAt)});\n`;
    }
    sql += '\n';

    // Experience
    const experiences = await prisma.experience.findMany();
    sql += '-- ========================================\n';
    sql += '-- TABLE: experiences\n';
    sql += '-- ========================================\n';
    sql += `DROP TABLE IF EXISTS \`experiences\`;\n`;
    sql += `CREATE TABLE \`experiences\` (
      \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
      \`userId\` VARCHAR(191) NOT NULL,
      \`company\` VARCHAR(255) NOT NULL,
      \`position\` VARCHAR(255) NOT NULL,
      \`location\` VARCHAR(255) NULL,
      \`startDate\` DATETIME NOT NULL,
      \`endDate\` DATETIME NULL,
      \`current\` TINYINT(1) NOT NULL DEFAULT 0,
      \`description\` TEXT NULL,
      \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX \`idx_experiences_userId\` (\`userId\`),
      CONSTRAINT \`fk_experiences_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    
    for (const e of experiences) {
      sql += `INSERT INTO \`experiences\` VALUES (${escapeSQL(e.id)}, ${escapeSQL(e.userId)}, ${escapeSQL(e.company)}, ${escapeSQL(e.position)}, ${escapeSQL(e.location)}, ${formatDate(e.startDate)}, ${formatDate(e.endDate)}, ${e.current ? 1 : 0}, ${escapeSQL(e.description)}, ${formatDate(e.createdAt)}, ${formatDate(e.updatedAt)});\n`;
    }
    sql += '\n';

    // Achievements
    const achievements = await prisma.achievement.findMany();
    sql += '-- ========================================\n';
    sql += '-- TABLE: achievements\n';
    sql += '-- ========================================\n';
    sql += `DROP TABLE IF EXISTS \`achievements\`;\n`;
    sql += `CREATE TABLE \`achievements\` (
      \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
      \`userId\` VARCHAR(191) NOT NULL,
      \`title\` VARCHAR(255) NOT NULL,
      \`description\` TEXT NULL,
      \`date\` DATETIME NULL,
      \`issuer\` VARCHAR(255) NULL,
      \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX \`idx_achievements_userId\` (\`userId\`),
      CONSTRAINT \`fk_achievements_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    
    for (const a of achievements) {
      sql += `INSERT INTO \`achievements\` VALUES (${escapeSQL(a.id)}, ${escapeSQL(a.userId)}, ${escapeSQL(a.title)}, ${escapeSQL(a.description)}, ${formatDate(a.date)}, ${escapeSQL(a.issuer)}, ${formatDate(a.createdAt)}, ${formatDate(a.updatedAt)});\n`;
    }
    sql += '\n';

    // Portfolios
    const portfolios = await prisma.portfolio.findMany();
    sql += '-- ========================================\n';
    sql += '-- TABLE: portfolios\n';
    sql += '-- ========================================\n';
    sql += `DROP TABLE IF EXISTS \`portfolios\`;\n`;
    sql += `CREATE TABLE \`portfolios\` (
      \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
      \`userId\` VARCHAR(191) NOT NULL,
      \`title\` VARCHAR(255) NOT NULL,
      \`description\` TEXT NULL,
      \`link\` VARCHAR(500) NULL,
      \`images\` TEXT NULL,
      \`technologies\` TEXT NULL,
      \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX \`idx_portfolios_userId\` (\`userId\`),
      CONSTRAINT \`fk_portfolios_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    
    for (const p of portfolios) {
      sql += `INSERT INTO \`portfolios\` VALUES (${escapeSQL(p.id)}, ${escapeSQL(p.userId)}, ${escapeSQL(p.title)}, ${escapeSQL(p.description)}, ${escapeSQL(p.link)}, ${escapeSQL(p.images)}, ${escapeSQL(p.technologies)}, ${formatDate(p.createdAt)}, ${formatDate(p.updatedAt)});\n`;
    }
    sql += '\n';

    // Conversations
    const conversations = await prisma.conversation.findMany();
    sql += '-- ========================================\n';
    sql += '-- TABLE: conversations\n';
    sql += '-- ========================================\n';
    sql += `DROP TABLE IF EXISTS \`conversations\`;\n`;
    sql += `CREATE TABLE \`conversations\` (
      \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
      \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    
    for (const c of conversations) {
      sql += `INSERT INTO \`conversations\` VALUES (${escapeSQL(c.id)}, ${formatDate(c.createdAt)}, ${formatDate(c.updatedAt)});\n`;
    }
    sql += '\n';

    // Conversation Participants
    const convParticipants = await prisma.conversationParticipant.findMany();
    sql += '-- ========================================\n';
    sql += '-- TABLE: conversation_participants\n';
    sql += '-- ========================================\n';
    sql += `DROP TABLE IF EXISTS \`conversation_participants\`;\n`;
    sql += `CREATE TABLE \`conversation_participants\` (
      \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
      \`conversationId\` VARCHAR(191) NOT NULL,
      \`userId\` VARCHAR(191) NOT NULL,
      \`joinedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`lastReadAt\` DATETIME NULL,
      UNIQUE KEY \`uk_conv_participants\` (\`userId\`, \`conversationId\`),
      INDEX \`idx_conv_participants_conv\` (\`conversationId\`),
      INDEX \`idx_conv_participants_user\` (\`userId\`),
      CONSTRAINT \`fk_conv_participants_conv\` FOREIGN KEY (\`conversationId\`) REFERENCES \`conversations\`(\`id\`) ON DELETE CASCADE,
      CONSTRAINT \`fk_conv_participants_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    
    for (const cp of convParticipants) {
      sql += `INSERT INTO \`conversation_participants\` VALUES (${escapeSQL(cp.id)}, ${escapeSQL(cp.conversationId)}, ${escapeSQL(cp.userId)}, ${formatDate(cp.joinedAt)}, ${formatDate(cp.lastReadAt)});\n`;
    }
    sql += '\n';

    // Messages
    const messages = await prisma.message.findMany();
    sql += '-- ========================================\n';
    sql += '-- TABLE: messages\n';
    sql += '-- ========================================\n';
    sql += `DROP TABLE IF EXISTS \`messages\`;\n`;
    sql += `CREATE TABLE \`messages\` (
      \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
      \`conversationId\` VARCHAR(191) NOT NULL,
      \`senderId\` VARCHAR(191) NOT NULL,
      \`content\` TEXT NOT NULL,
      \`images\` TEXT NULL,
      \`read\` TINYINT(1) NOT NULL DEFAULT 0,
      \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX \`idx_messages_conv\` (\`conversationId\`),
      INDEX \`idx_messages_sender\` (\`senderId\`),
      CONSTRAINT \`fk_messages_conv\` FOREIGN KEY (\`conversationId\`) REFERENCES \`conversations\`(\`id\`) ON DELETE CASCADE,
      CONSTRAINT \`fk_messages_sender\` FOREIGN KEY (\`senderId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    
    for (const m of messages) {
      sql += `INSERT INTO \`messages\` VALUES (${escapeSQL(m.id)}, ${escapeSQL(m.conversationId)}, ${escapeSQL(m.senderId)}, ${escapeSQL(m.content)}, ${escapeSQL(m.images)}, ${m.read ? 1 : 0}, ${formatDate(m.createdAt)});\n`;
    }
    sql += '\n';

    // Events
    const events = await prisma.event.findMany();
    sql += '-- ========================================\n';
    sql += '-- TABLE: events\n';
    sql += '-- ========================================\n';
    sql += `DROP TABLE IF EXISTS \`events\`;\n`;
    sql += `CREATE TABLE \`events\` (
      \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
      \`title\` VARCHAR(255) NOT NULL,
      \`description\` TEXT NULL,
      \`image\` TEXT NULL,
      \`startDate\` DATETIME NOT NULL,
      \`endDate\` DATETIME NULL,
      \`location\` VARCHAR(255) NULL,
      \`locationType\` VARCHAR(50) NOT NULL DEFAULT 'offline',
      \`onlineUrl\` VARCHAR(500) NULL,
      \`category\` VARCHAR(50) NOT NULL DEFAULT 'seminar',
      \`maxAttendees\` INT NULL,
      \`isFree\` TINYINT(1) NOT NULL DEFAULT 1,
      \`price\` VARCHAR(100) NULL,
      \`status\` VARCHAR(50) NOT NULL DEFAULT 'upcoming',
      \`createdById\` VARCHAR(191) NOT NULL,
      \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX \`idx_events_creator\` (\`createdById\`),
      INDEX \`idx_events_startDate\` (\`startDate\`),
      INDEX \`idx_events_category\` (\`category\`),
      CONSTRAINT \`fk_events_creator\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    
    for (const e of events) {
      sql += `INSERT INTO \`events\` VALUES (${escapeSQL(e.id)}, ${escapeSQL(e.title)}, ${escapeSQL(e.description)}, ${escapeSQL(e.image)}, ${formatDate(e.startDate)}, ${formatDate(e.endDate)}, ${escapeSQL(e.location)}, ${escapeSQL(e.locationType)}, ${escapeSQL(e.onlineUrl)}, ${escapeSQL(e.category)}, ${e.maxAttendees || 'NULL'}, ${e.isFree ? 1 : 0}, ${escapeSQL(e.price)}, ${escapeSQL(e.status)}, ${escapeSQL(e.createdById)}, ${formatDate(e.createdAt)}, ${formatDate(e.updatedAt)});\n`;
    }
    sql += '\n';

    // Event Attendances
    const eventAttendances = await prisma.eventAttendance.findMany();
    sql += '-- ========================================\n';
    sql += '-- TABLE: event_attendances\n';
    sql += '-- ========================================\n';
    sql += `DROP TABLE IF EXISTS \`event_attendances\`;\n`;
    sql += `CREATE TABLE \`event_attendances\` (
      \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
      \`eventId\` VARCHAR(191) NOT NULL,
      \`userId\` VARCHAR(191) NOT NULL,
      \`status\` VARCHAR(50) NOT NULL DEFAULT 'interested',
      \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY \`uk_event_attendances\` (\`userId\`, \`eventId\`),
      INDEX \`idx_event_attendances_event\` (\`eventId\`),
      INDEX \`idx_event_attendances_user\` (\`userId\`),
      CONSTRAINT \`fk_event_attendances_event\` FOREIGN KEY (\`eventId\`) REFERENCES \`events\`(\`id\`) ON DELETE CASCADE,
      CONSTRAINT \`fk_event_attendances_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    
    for (const ea of eventAttendances) {
      sql += `INSERT INTO \`event_attendances\` VALUES (${escapeSQL(ea.id)}, ${escapeSQL(ea.eventId)}, ${escapeSQL(ea.userId)}, ${escapeSQL(ea.status)}, ${formatDate(ea.createdAt)}, ${formatDate(ea.updatedAt)});\n`;
    }
    sql += '\n';

    sql += 'SET FOREIGN_KEY_CHECKS = 1;\n';
    sql += '-- ================================================\n';
    sql += '-- END OF EXPORT\n';
    sql += '-- ================================================\n';

    fs.writeFileSync('db/mysql-export-full.sql', sql);
    console.log('✅ Export lengkap berhasil! File: db/mysql-export-full.sql');
    console.log(`   - ${users.length} users`);
    console.log(`   - ${posts.length} posts`);
    console.log(`   - ${comments.length} comments`);
    console.log(`   - ${likes.length} likes`);
    console.log(`   - ${friendships.length} friendships`);
    console.log(`   - ${groups.length} groups`);
    console.log(`   - ${groupMembers.length} group_members`);
    console.log(`   - ${notifications.length} notifications`);
    console.log(`   - ${educations.length} educations`);
    console.log(`   - ${experiences.length} experiences`);
    console.log(`   - ${achievements.length} achievements`);
    console.log(`   - ${portfolios.length} portfolios`);
    console.log(`   - ${conversations.length} conversations`);
    console.log(`   - ${convParticipants.length} conversation_participants`);
    console.log(`   - ${messages.length} messages`);
    console.log(`   - ${events.length} events`);
    console.log(`   - ${eventAttendances.length} event_attendances`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportToMySQL();
