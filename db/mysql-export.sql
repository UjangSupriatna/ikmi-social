-- IKMI SOCIAL Database Export to MySQL
-- Generated: 2026-03-25T03:11:23.449Z

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table: users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
      `id` VARCHAR(255) NOT NULL PRIMARY KEY,
      `email` VARCHAR(255) NOT NULL UNIQUE,
      `password` VARCHAR(255) NOT NULL,
      `name` VARCHAR(255) NOT NULL,
      `username` VARCHAR(255) NOT NULL UNIQUE,
      `avatar` TEXT,
      `coverPhoto` TEXT,
      `bio` TEXT,
      `phone` VARCHAR(50),
      `address` TEXT,
      `website` VARCHAR(255),
      `headline` VARCHAR(255),
      `skills` TEXT,
      `birthday` DATETIME,
      `gender` VARCHAR(20),
      `createdAt` DATETIME NOT NULL,
      `updatedAt` DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` VALUES ('cmn5dxxn9000mnhq4ad8abf21', 'test@example.com', '$2b$12$myHDCYGX4sv9FY0.s8lBGOYNiLIOSH5pOPm5Kk0ZEjRPNLjgsQ15m', 'Test User', 'testuser', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-25T01:49:12.982Z', '2026-03-25T01:49:12.982Z');

-- ----------------------------
-- Table: posts
-- ----------------------------
DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts` (
      `id` VARCHAR(255) NOT NULL PRIMARY KEY,
      `content` TEXT NOT NULL,
      `images` TEXT,
      `location` VARCHAR(255),
      `visibility` VARCHAR(50) DEFAULT 'public',
      `groupId` VARCHAR(255),
      `authorId` VARCHAR(255) NOT NULL,
      `createdAt` DATETIME NOT NULL,
      `updatedAt` DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ----------------------------
-- Table: events
-- ----------------------------
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
      `id` VARCHAR(255) NOT NULL PRIMARY KEY,
      `title` VARCHAR(255) NOT NULL,
      `description` TEXT,
      `image` TEXT,
      `startDate` DATETIME NOT NULL,
      `endDate` DATETIME,
      `location` VARCHAR(255),
      `locationType` VARCHAR(50) DEFAULT 'offline',
      `onlineUrl` VARCHAR(255),
      `category` VARCHAR(50) DEFAULT 'seminar',
      `maxAttendees` INT,
      `isFree` TINYINT(1) DEFAULT 1,
      `price` VARCHAR(100),
      `status` VARCHAR(50) DEFAULT 'upcoming',
      `createdById` VARCHAR(255) NOT NULL,
      `createdAt` DATETIME NOT NULL,
      `updatedAt` DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `events` VALUES ('cmn5eme1e0001nh0mt3wn4168', 'Seminar AI 2025', 'Seminar tentang AI', NULL, '2025-06-15T09:00:00.000Z', NULL, 'Aula IKMI', 'offline', NULL, 'seminar', NULL, 1, NULL, 'upcoming', 'cmn5dxxn9000mnhq4ad8abf21', '2026-03-25T02:08:13.971Z', '2026-03-25T02:08:13.971Z');
INSERT INTO `events` VALUES ('cmn5eok220001nh3p1qpl5ac7', 'Workshop Web Development', 'Workshop praktis membuat website modern dengan React dan Next.js', NULL, '2025-07-20T13:00:00.000Z', '2025-07-20T17:00:00.000Z', 'Lab Komputer IKMI', 'offline', NULL, 'workshop', 30, 1, NULL, 'upcoming', 'cmn5dxxn9000mnhq4ad8abf21', '2026-03-25T02:09:55.082Z', '2026-03-25T02:09:55.082Z');
INSERT INTO `events` VALUES ('cmn5eok2z0003nh3prrvmhtja', 'Webinar Karir IT', 'Webinar tentang peluang karir di industri IT bersama praktisi', NULL, '2025-08-10T19:00:00.000Z', '2025-08-10T21:00:00.000Z', NULL, 'online', 'https://zoom.us/j/123456', 'webinar', NULL, 1, NULL, 'upcoming', 'cmn5dxxn9000mnhq4ad8abf21', '2026-03-25T02:09:55.116Z', '2026-03-25T02:09:55.116Z');
INSERT INTO `events` VALUES ('cmn5eok3z0005nh3p0agrwpkc', 'Hackathon IKMI 2025', 'Kompetisi programming 24 jam untuk mahasiswa IKMI', NULL, '2025-09-05T08:00:00.000Z', '2025-09-06T08:00:00.000Z', 'Gedung Serbaguna IKMI', 'offline', NULL, 'competition', 100, 1, NULL, 'upcoming', 'cmn5dxxn9000mnhq4ad8abf21', '2026-03-25T02:09:55.151Z', '2026-03-25T02:09:55.151Z');

SET FOREIGN_KEY_CHECKS = 1;
-- End of export
