const fs = require('fs');
const { execSync } = require('child_process');

// Use prisma to get the data
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function exportToMySQL() {
  let sql = '-- IKMI SOCIAL Database Export to MySQL\n';
  sql += '-- Generated: ' + new Date().toISOString() + '\n\n';
  sql += 'SET NAMES utf8mb4;\n';
  sql += 'SET FOREIGN_KEY_CHECKS = 0;\n\n';

  try {
    // Export Users
    const users = await prisma.user.findMany();
    sql += '-- ----------------------------\n';
    sql += '-- Table: users\n';
    sql += '-- ----------------------------\n';
    sql += 'DROP TABLE IF EXISTS `users`;\n';
    sql += `CREATE TABLE \`users\` (
      \`id\` VARCHAR(255) NOT NULL PRIMARY KEY,
      \`email\` VARCHAR(255) NOT NULL UNIQUE,
      \`password\` VARCHAR(255) NOT NULL,
      \`name\` VARCHAR(255) NOT NULL,
      \`username\` VARCHAR(255) NOT NULL UNIQUE,
      \`avatar\` TEXT,
      \`coverPhoto\` TEXT,
      \`bio\` TEXT,
      \`phone\` VARCHAR(50),
      \`address\` TEXT,
      \`website\` VARCHAR(255),
      \`headline\` VARCHAR(255),
      \`skills\` TEXT,
      \`birthday\` DATETIME,
      \`gender\` VARCHAR(20),
      \`createdAt\` DATETIME NOT NULL,
      \`updatedAt\` DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;
    
    for (const u of users) {
      sql += `INSERT INTO \`users\` VALUES ('${u.id}', '${u.email}', '${u.password}', '${u.name.replace(/'/g, "''")}', '${u.username}', ${u.avatar ? `'${u.avatar}'` : 'NULL'}, ${u.coverPhoto ? `'${u.coverPhoto}'` : 'NULL'}, ${u.bio ? `'${u.bio.replace(/'/g, "''")}'` : 'NULL'}, ${u.phone ? `'${u.phone}'` : 'NULL'}, ${u.address ? `'${u.address.replace(/'/g, "''")}'` : 'NULL'}, ${u.website ? `'${u.website}'` : 'NULL'}, ${u.headline ? `'${u.headline.replace(/'/g, "''")}'` : 'NULL'}, ${u.skills ? `'${u.skills}'` : 'NULL'}, ${u.birthday ? `'${u.birthday.toISOString()}'` : 'NULL'}, ${u.gender ? `'${u.gender}'` : 'NULL'}, '${u.createdAt.toISOString()}', '${u.updatedAt.toISOString()}');\n`;
    }
    sql += '\n';

    // Export Posts
    const posts = await prisma.post.findMany();
    sql += '-- ----------------------------\n';
    sql += '-- Table: posts\n';
    sql += '-- ----------------------------\n';
    sql += 'DROP TABLE IF EXISTS `posts`;\n';
    sql += `CREATE TABLE \`posts\` (
      \`id\` VARCHAR(255) NOT NULL PRIMARY KEY,
      \`content\` TEXT NOT NULL,
      \`images\` TEXT,
      \`location\` VARCHAR(255),
      \`visibility\` VARCHAR(50) DEFAULT 'public',
      \`groupId\` VARCHAR(255),
      \`authorId\` VARCHAR(255) NOT NULL,
      \`createdAt\` DATETIME NOT NULL,
      \`updatedAt\` DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;
    
    for (const p of posts) {
      sql += `INSERT INTO \`posts\` VALUES ('${p.id}', '${p.content.replace(/'/g, "''")}', ${p.images ? `'${p.images}'` : 'NULL'}, ${p.location ? `'${p.location.replace(/'/g, "''")}'` : 'NULL'}, '${p.visibility}', ${p.groupId ? `'${p.groupId}'` : 'NULL'}, '${p.authorId}', '${p.createdAt.toISOString()}', '${p.updatedAt.toISOString()}');\n`;
    }
    sql += '\n';

    // Export Events
    const events = await prisma.event.findMany();
    sql += '-- ----------------------------\n';
    sql += '-- Table: events\n';
    sql += '-- ----------------------------\n';
    sql += 'DROP TABLE IF EXISTS `events`;\n';
    sql += `CREATE TABLE \`events\` (
      \`id\` VARCHAR(255) NOT NULL PRIMARY KEY,
      \`title\` VARCHAR(255) NOT NULL,
      \`description\` TEXT,
      \`image\` TEXT,
      \`startDate\` DATETIME NOT NULL,
      \`endDate\` DATETIME,
      \`location\` VARCHAR(255),
      \`locationType\` VARCHAR(50) DEFAULT 'offline',
      \`onlineUrl\` VARCHAR(255),
      \`category\` VARCHAR(50) DEFAULT 'seminar',
      \`maxAttendees\` INT,
      \`isFree\` TINYINT(1) DEFAULT 1,
      \`price\` VARCHAR(100),
      \`status\` VARCHAR(50) DEFAULT 'upcoming',
      \`createdById\` VARCHAR(255) NOT NULL,
      \`createdAt\` DATETIME NOT NULL,
      \`updatedAt\` DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;
    
    for (const e of events) {
      sql += `INSERT INTO \`events\` VALUES ('${e.id}', '${e.title.replace(/'/g, "''")}', ${e.description ? `'${e.description.replace(/'/g, "''")}'` : 'NULL'}, ${e.image ? `'${e.image}'` : 'NULL'}, '${e.startDate.toISOString()}', ${e.endDate ? `'${e.endDate.toISOString()}'` : 'NULL'}, ${e.location ? `'${e.location.replace(/'/g, "''")}'` : 'NULL'}, '${e.locationType}', ${e.onlineUrl ? `'${e.onlineUrl}'` : 'NULL'}, '${e.category}', ${e.maxAttendees || 'NULL'}, ${e.isFree ? 1 : 0}, ${e.price ? `'${e.price}'` : 'NULL'}, '${e.status}', '${e.createdById}', '${e.createdAt.toISOString()}', '${e.updatedAt.toISOString()}');\n`;
    }
    sql += '\n';

    sql += 'SET FOREIGN_KEY_CHECKS = 1;\n';
    sql += '-- End of export\n';

    fs.writeFileSync('db/mysql-export.sql', sql);
    console.log('✅ Export berhasil! File: db/mysql-export.sql');
    console.log(`   - ${users.length} users`);
    console.log(`   - ${posts.length} posts`);
    console.log(`   - ${events.length} events`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportToMySQL();
