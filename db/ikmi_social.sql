-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 26 Mar 2026 pada 19.55
-- Versi server: 10.4.22-MariaDB
-- Versi PHP: 7.4.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ikmi_social`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `achievements`
--

CREATE TABLE `achievements` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime(3) DEFAULT NULL,
  `issuer` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `achievements`
--

INSERT INTO `achievements` (`id`, `userId`, `title`, `description`, `date`, `issuer`, `createdAt`, `updatedAt`) VALUES
('cmn6lsez0000ftkkwzsj6kmsh', 'cmn6f43fv0000tk6cfe94kiw7', 'jnj', NULL, '2026-03-26 00:00:00.000', ' vvb', '2026-03-25 22:16:38.605', '2026-03-25 22:16:38.605');

-- --------------------------------------------------------

--
-- Struktur dari tabel `api`
--

CREATE TABLE `api` (
  `id` int(11) NOT NULL DEFAULT 1,
  `baseurl` varchar(191) NOT NULL,
  `key_api` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `api`
--

INSERT INTO `api` (`id`, `baseurl`, `key_api`) VALUES
(1, 'https://api.koboillm.com/v1', 'sk-kO4S8mUMrB4bVV1ZeAkpJA');

-- --------------------------------------------------------

--
-- Struktur dari tabel `comments`
--

CREATE TABLE `comments` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `images` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `authorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parentId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `comments`
--

INSERT INTO `comments` (`id`, `content`, `images`, `postId`, `authorId`, `parentId`, `createdAt`, `updatedAt`) VALUES
('cmn7rkrjr0009tka8pot0gzip', 'Cantik', NULL, 'cmn70d99t0001tkb08oxlrvhs', 'cmn6f6iwx0001tk6ccol99g2t', NULL, '2026-03-26 17:46:25.527', '2026-03-26 17:46:25.527'),
('cmn7rm84g000btka8y7o57jb4', '@admin ganteng', NULL, 'cmn70d99t0001tkb08oxlrvhs', 'cmn6f6iwx0001tk6ccol99g2t', NULL, '2026-03-26 17:47:33.665', '2026-03-26 17:47:33.665'),
('cmn7ryzp90001tke4x8g9uoou', 'ehem ah', NULL, 'cmn70d99t0001tkb08oxlrvhs', 'cmn6f43fv0000tk6cfe94kiw7', NULL, '2026-03-26 17:57:29.277', '2026-03-26 17:57:29.277'),
('cmn7sff0q0001tkxwzd725kyr', 'Apa', NULL, 'cmn70d99t0001tkb08oxlrvhs', 'cmn6f6iwx0001tk6ccol99g2t', 'cmn7ryzp90001tke4x8g9uoou', '2026-03-26 18:10:15.626', '2026-03-26 18:10:15.626'),
('cmn7tgevn000ftkrs90ossp6c', '@admin hadir', NULL, 'cmn7oqf2g0001tkawfifhpqjn', 'cmn6f6iwx0001tk6ccol99g2t', NULL, '2026-03-26 18:39:01.715', '2026-03-26 18:39:01.715'),
('cmn7th76p000jtkrs0g23lseo', 'apa anj', NULL, 'cmn7oqf2g0001tkawfifhpqjn', 'cmn6f43fv0000tk6cfe94kiw7', 'cmn7tgevn000ftkrs90ossp6c', '2026-03-26 18:39:38.402', '2026-03-26 18:39:38.402');

-- --------------------------------------------------------

--
-- Struktur dari tabel `conversations`
--

CREATE TABLE `conversations` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `conversations`
--

INSERT INTO `conversations` (`id`, `createdAt`, `updatedAt`) VALUES
('cmn6f75n20008tk6crdowgsly', '2026-03-25 19:12:09.039', '2026-03-26 06:40:16.869');

-- --------------------------------------------------------

--
-- Struktur dari tabel `conversation_participants`
--

CREATE TABLE `conversation_participants` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `conversationId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `joinedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `lastReadAt` datetime(3) DEFAULT NULL,
  `clearedAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `conversation_participants`
--

INSERT INTO `conversation_participants` (`id`, `conversationId`, `userId`, `joinedAt`, `lastReadAt`, `clearedAt`) VALUES
('cmn6f75n2000atk6cwhn31kju', 'cmn6f75n20008tk6crdowgsly', 'cmn6f43fv0000tk6cfe94kiw7', '2026-03-25 19:12:09.039', '2026-03-26 14:30:06.000', NULL),
('cmn6f75n2000btk6csgy61ro3', 'cmn6f75n20008tk6crdowgsly', 'cmn6f6iwx0001tk6ccol99g2t', '2026-03-25 19:12:09.039', '2026-03-26 23:24:47.000', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `educations`
--

CREATE TABLE `educations` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institution` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `degree` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `field` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) DEFAULT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `educations`
--

INSERT INTO `educations` (`id`, `userId`, `institution`, `degree`, `field`, `startDate`, `endDate`, `description`, `createdAt`, `updatedAt`) VALUES
('cmn6lrh8g0009tkkwyxmyh2h7', 'cmn6f43fv0000tk6cfe94kiw7', 'Cisco Academy', 'Sarjanas', 'Teknik Informatika', '2026-03-01 00:00:00.000', '2026-03-01 00:00:00.000', NULL, '2026-03-25 22:15:54.881', '2026-03-25 22:15:54.881'),
('cmn6lrrwe000btkkwzczg3sjb', 'cmn6f43fv0000tk6cfe94kiw7', 'Lembaga Sertifikasi Profesi', 'Sarjanas', 'Teknik Informatika', '2026-03-01 00:00:00.000', '2026-03-01 00:00:00.000', NULL, '2026-03-25 22:16:08.703', '2026-03-25 22:16:08.703');

-- --------------------------------------------------------

--
-- Struktur dari tabel `events`
--

CREATE TABLE `events` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) DEFAULT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `locationType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'offline',
  `onlineUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'seminar',
  `maxAttendees` int(11) DEFAULT NULL,
  `isFree` tinyint(1) NOT NULL DEFAULT 1,
  `price` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'upcoming',
  `createdById` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `image`, `startDate`, `endDate`, `location`, `locationType`, `onlineUrl`, `category`, `maxAttendees`, `isFree`, `price`, `status`, `createdById`, `createdAt`, `updatedAt`) VALUES
('cmn6z0u5k0009tk6gpuo1x5w1', 'Seminar Web Development', 'Seminar Nasional', '/uploads/events/event-1774510241206-i0rywl.jpg', '2026-03-28 04:27:00.000', '2026-03-29 04:27:00.000', 'Aula Kampus', 'offline', NULL, 'seminar', NULL, 1, NULL, 'upcoming', 'cmn6f6iwx0001tk6ccol99g2t', '2026-03-26 04:27:06.536', '2026-03-26 07:30:43.089');

-- --------------------------------------------------------

--
-- Struktur dari tabel `event_attendances`
--

CREATE TABLE `event_attendances` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `eventId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'interested',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `experiences`
--

CREATE TABLE `experiences` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) DEFAULT NULL,
  `current` tinyint(1) NOT NULL DEFAULT 0,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `experiences`
--

INSERT INTO `experiences` (`id`, `userId`, `company`, `position`, `location`, `startDate`, `endDate`, `current`, `description`, `createdAt`, `updatedAt`) VALUES
('cmn6ls5io000dtkkwdwg8tekj', 'cmn6f43fv0000tk6cfe94kiw7', 'STMIK IKMI Cirebon', 'Tenaga Pendamping dan Pendataan Domisili Kab. Bandung', 'Indonesia', '2026-03-01 00:00:00.000', '2026-03-01 00:00:00.000', 0, NULL, '2026-03-25 22:16:26.353', '2026-03-25 22:16:26.353');

-- --------------------------------------------------------

--
-- Struktur dari tabel `friendships`
--

CREATE TABLE `friendships` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `friendId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `friendships`
--

INSERT INTO `friendships` (`id`, `userId`, `friendId`, `status`, `createdAt`, `updatedAt`) VALUES
('cmn7smsne0001tkn8l0rovoow', 'cmn6f43fv0000tk6cfe94kiw7', 'cmn6f6iwx0001tk6ccol99g2t', 'accepted', '2026-03-26 18:15:59.882', '2026-03-26 18:19:18.991'),
('friend_001', 'cmn6f6iwx0001tk6ccol99g2t', 'user_demo_001', 'accepted', '2026-03-26 13:47:16.000', '2026-03-26 13:47:16.000'),
('friend_002', 'cmn6f6iwx0001tk6ccol99g2t', 'user_demo_002', 'accepted', '2026-03-26 13:47:16.000', '2026-03-26 13:47:16.000'),
('friend_003', 'cmn6f6iwx0001tk6ccol99g2t', 'user_demo_003', 'accepted', '2026-03-26 13:47:16.000', '2026-03-26 13:47:16.000'),
('friend_004', 'cmn6f6iwx0001tk6ccol99g2t', 'user_demo_004', 'accepted', '2026-03-26 13:47:16.000', '2026-03-26 13:47:16.000'),
('friend_005', 'cmn6f6iwx0001tk6ccol99g2t', 'user_demo_005', 'accepted', '2026-03-26 13:47:16.000', '2026-03-26 13:47:16.000'),
('friend_006', 'cmn6f6iwx0001tk6ccol99g2t', 'user_demo_006', 'accepted', '2026-03-26 13:47:16.000', '2026-03-26 13:47:16.000'),
('friend_007', 'cmn6f6iwx0001tk6ccol99g2t', 'user_demo_007', 'accepted', '2026-03-26 13:47:16.000', '2026-03-26 13:47:16.000'),
('friend_008', 'cmn6f6iwx0001tk6ccol99g2t', 'user_demo_008', 'accepted', '2026-03-26 13:47:16.000', '2026-03-26 13:47:16.000'),
('friend_009', 'cmn6f6iwx0001tk6ccol99g2t', 'user_demo_009', 'accepted', '2026-03-26 13:47:16.000', '2026-03-26 13:47:16.000'),
('friend_010', 'cmn6f6iwx0001tk6ccol99g2t', 'user_demo_010', 'accepted', '2026-03-26 13:47:16.000', '2026-03-26 13:47:16.000');

-- --------------------------------------------------------

--
-- Struktur dari tabel `groups`
--

CREATE TABLE `groups` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coverImage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `privacy` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'public',
  `createdById` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `groups`
--

INSERT INTO `groups` (`id`, `name`, `description`, `coverImage`, `avatar`, `privacy`, `createdById`, `createdAt`, `updatedAt`) VALUES
('cmn6yyjrz0001tk6grhpwsci2', 'UKM Android', 'Ini group UKM android', NULL, NULL, 'public', 'cmn6f6iwx0001tk6ccol99g2t', '2026-03-26 04:25:19.730', '2026-03-26 04:25:19.730'),
('cmn6yzacl0005tk6gm1r9c0iq', 'UKM Web Development', 'Ini Grup UKM Web Development', NULL, NULL, 'private', 'cmn6f6iwx0001tk6ccol99g2t', '2026-03-26 04:25:54.214', '2026-03-26 04:25:54.214');

-- --------------------------------------------------------

--
-- Struktur dari tabel `group_join_requests`
--

CREATE TABLE `group_join_requests` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `groupId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `message` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `group_join_requests`
--

INSERT INTO `group_join_requests` (`id`, `userId`, `groupId`, `status`, `message`, `createdAt`, `updatedAt`) VALUES
('cmn73fztc000btkl0g9e9egrd', 'cmn6f43fv0000tk6cfe94kiw7', 'cmn6yzacl0005tk6gm1r9c0iq', 'approved', NULL, '2026-03-26 06:30:52.177', '2026-03-26 06:30:57.474');

-- --------------------------------------------------------

--
-- Struktur dari tabel `group_members`
--

CREATE TABLE `group_members` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `groupId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'member',
  `joinedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `group_members`
--

INSERT INTO `group_members` (`id`, `userId`, `groupId`, `role`, `joinedAt`) VALUES
('cmn6yyjrz0003tk6g95ynpjoo', 'cmn6f6iwx0001tk6ccol99g2t', 'cmn6yyjrz0001tk6grhpwsci2', 'admin', '2026-03-26 04:25:19.730'),
('cmn6yzacl0007tk6g2puaxant', 'cmn6f6iwx0001tk6ccol99g2t', 'cmn6yzacl0005tk6gm1r9c0iq', 'admin', '2026-03-26 04:25:54.214'),
('cmn73g3wi000etkl0o75a36qd', 'cmn6f43fv0000tk6cfe94kiw7', 'cmn6yzacl0005tk6gm1r9c0iq', 'member', '2026-03-26 06:30:57.474');

-- --------------------------------------------------------

--
-- Struktur dari tabel `likes`
--

CREATE TABLE `likes` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commentId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `messages`
--

CREATE TABLE `messages` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `conversationId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `senderId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `images` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `read` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `messages`
--

INSERT INTO `messages` (`id`, `conversationId`, `senderId`, `content`, `images`, `read`, `createdAt`) VALUES
('cmn6f7c0y000dtk6cjt819fby', 'cmn6f75n20008tk6crdowgsly', 'cmn6f43fv0000tk6cfe94kiw7', 'hallo', NULL, 1, '2026-03-25 19:12:17.314'),
('cmn6f7i6x000ftk6cijgodc4v', 'cmn6f75n20008tk6crdowgsly', 'cmn6f6iwx0001tk6ccol99g2t', 'hi', NULL, 1, '2026-03-25 19:12:25.305'),
('cmn6g02j30001tk04i2az372m', 'cmn6f75n20008tk6crdowgsly', 'cmn6f43fv0000tk6cfe94kiw7', 'hallo sayang', NULL, 1, '2026-03-25 19:34:38.032'),
('cmn6g0vvp0003tk04b7mw8dt3', 'cmn6f75n20008tk6crdowgsly', 'cmn6f6iwx0001tk6ccol99g2t', 'yaa', NULL, 1, '2026-03-25 19:35:16.070'),
('cmn6g226c0005tk049owrxb4q', 'cmn6f75n20008tk6crdowgsly', 'cmn6f43fv0000tk6cfe94kiw7', 'p', NULL, 1, '2026-03-25 19:36:10.884'),
('cmn6g2rff0007tk04mcu6mder', 'cmn6f75n20008tk6crdowgsly', 'cmn6f43fv0000tk6cfe94kiw7', 'ini 1', NULL, 1, '2026-03-25 19:36:43.611'),
('cmn6g3x9w0009tk043kjzqqrb', 'cmn6f75n20008tk6crdowgsly', 'cmn6f6iwx0001tk6ccol99g2t', 'p', NULL, 1, '2026-03-25 19:37:37.845'),
('cmn6gboik0001tkz4uqk1tzdn', 'cmn6f75n20008tk6crdowgsly', 'cmn6f6iwx0001tk6ccol99g2t', 'Haii', NULL, 1, '2026-03-25 19:43:39.741'),
('cmn6gcr9h0003tkz48jkqlnax', 'cmn6f75n20008tk6crdowgsly', 'cmn6f43fv0000tk6cfe94kiw7', 'malam', NULL, 1, '2026-03-25 19:44:29.957'),
('cmn6ge5uq0005tkz4qfa9awzr', 'cmn6f75n20008tk6crdowgsly', 'cmn6f6iwx0001tk6ccol99g2t', 'P', NULL, 1, '2026-03-25 19:45:35.522'),
('cmn6gepx20007tkz43o0vl3q3', 'cmn6f75n20008tk6crdowgsly', 'cmn6f6iwx0001tk6ccol99g2t', 'Yaa', NULL, 1, '2026-03-25 19:46:01.526'),
('cmn6gf5u80009tkz4vldemkv5', 'cmn6f75n20008tk6crdowgsly', 'cmn6f43fv0000tk6cfe94kiw7', 'p', NULL, 1, '2026-03-25 19:46:22.160'),
('cmn6gluxd0001tkzgwwi1g2ju', 'cmn6f75n20008tk6crdowgsly', 'cmn6f6iwx0001tk6ccol99g2t', 'P', NULL, 1, '2026-03-25 19:51:34.610'),
('cmn6glzzs0003tkzguains5pt', 'cmn6f75n20008tk6crdowgsly', 'cmn6f6iwx0001tk6ccol99g2t', 'Jangan dihapus ya', NULL, 1, '2026-03-25 19:51:41.176'),
('cmn6gm9o30005tkzg4qajawtf', 'cmn6f75n20008tk6crdowgsly', 'cmn6f43fv0000tk6cfe94kiw7', 'oke', NULL, 1, '2026-03-25 19:51:53.715'),
('cmn6gmhn10007tkzge97z75dw', 'cmn6f75n20008tk6crdowgsly', 'cmn6f6iwx0001tk6ccol99g2t', 'Malam', NULL, 1, '2026-03-25 19:52:04.045'),
('cmn6gml460009tkzgixnt92n6', 'cmn6f75n20008tk6crdowgsly', 'cmn6f43fv0000tk6cfe94kiw7', 'juga', NULL, 1, '2026-03-25 19:52:08.551'),
('cmn6gnm2w000btkzg36izfn3g', 'cmn6f75n20008tk6crdowgsly', 'cmn6f43fv0000tk6cfe94kiw7', 'bales', NULL, 1, '2026-03-25 19:52:56.456'),
('cmn6peu6n0001tkdkmt726y46', 'cmn6f75n20008tk6crdowgsly', 'cmn6f6iwx0001tk6ccol99g2t', 'P', NULL, 1, '2026-03-25 23:58:03.579'),
('cmn6zs4ac0001tkfg29k7r1rm', 'cmn6f75n20008tk6crdowgsly', 'cmn6f6iwx0001tk6ccol99g2t', 'Lp', NULL, 1, '2026-03-26 04:48:19.327'),
('cmn73s3if0001tk04159kyykm', 'cmn6f75n20008tk6crdowgsly', 'cmn6f43fv0000tk6cfe94kiw7', 'mudik', NULL, 1, '2026-03-26 06:40:16.814');

-- --------------------------------------------------------

--
-- Struktur dari tabel `notifications`
--

CREATE TABLE `notifications` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `read` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `notifications`
--

INSERT INTO `notifications` (`id`, `userId`, `type`, `title`, `message`, `data`, `read`, `createdAt`) VALUES
('cmn6f6qk30005tk6chryt1hp7', 'cmn6f43fv0000tk6cfe94kiw7', 'friend_request', 'New Friend Request', 'Sifa Sayang sent you a friend request', '{\"fromUserId\":\"cmn6f6iwx0001tk6ccol99g2t\",\"friendshipId\":\"cmn6f6qjp0003tk6cw3utc3pf\"}', 1, '2026-03-25 19:11:49.491'),
('cmn6f719h0007tk6cyraskyh4', 'cmn6f6iwx0001tk6ccol99g2t', 'friend_accepted', 'Friend Request Accepted', 'Ujang Supriatna accepted your friend request', '{\"friendId\":\"cmn6f43fv0000tk6cfe94kiw7\",\"friendshipId\":\"cmn6f6qjp0003tk6cw3utc3pf\"}', 1, '2026-03-25 19:12:03.365'),
('cmn6jfzcd0003tk5s6bnahpak', 'user_004', 'friend_request', 'New Friend Request', 'Sifa Sayang sent you a friend request', '{\"fromUserId\":\"cmn6f6iwx0001tk6ccol99g2t\",\"friendshipId\":\"cmn6jfza50001tk5sop4lg82a\"}', 0, '2026-03-25 21:10:59.246'),
('cmn6jnxmg0003tkucvywkcogw', 'user_001', 'friend_request', 'New Friend Request', 'Sifa Sayang sent you a friend request', '{\"fromUserId\":\"cmn6f6iwx0001tk6ccol99g2t\",\"friendshipId\":\"cmn6jnxki0001tkucelrzabyw\"}', 0, '2026-03-25 21:17:10.264'),
('cmn719kbk0002tkawukx4gnpe', 'cmn6f6iwx0001tk6ccol99g2t', 'group_join_request', 'Permintaan Bergabung Grup', 'Ujang Supriatna ingin bergabung dengan grup UKM Web Development', '{\"groupId\":\"cmn6yzacl0005tk6gm1r9c0iq\",\"groupName\":\"UKM Web Development\",\"requestId\":\"cmn719k940001tkawvokzbzvu\",\"userId\":\"cmn6f43fv0000tk6cfe94kiw7\",\"userName\":\"Ujang Supriatna\"}', 1, '2026-03-26 05:29:52.928'),
('cmn71sy3p0001tkkwji3ikz66', 'cmn6f43fv0000tk6cfe94kiw7', 'group_join_rejected', 'Permintaan Ditolak', 'Permintaan bergabung ke grup UKM Web Development ditolak.', '{\"groupId\":\"cmn6yzacl0005tk6gm1r9c0iq\",\"groupName\":\"UKM Web Development\"}', 1, '2026-03-26 05:44:57.254'),
('cmn72r1m70000tk0gcategfo2', 'cmn6f6iwx0001tk6ccol99g2t', 'group_join_request', 'Permintaan Bergabung Grup', 'Ujang Supriatna ingin bergabung dengan grup UKM Web Development', '{\"groupId\":\"cmn6yzacl0005tk6gm1r9c0iq\",\"groupName\":\"UKM Web Development\",\"requestId\":\"cmn719k940001tkawvokzbzvu\",\"userId\":\"cmn6f43fv0000tk6cfe94kiw7\",\"userName\":\"Ujang Supriatna\"}', 1, '2026-03-26 06:11:28.111'),
('cmn72rwvw0002tk0g4fsnhk9j', 'cmn6f43fv0000tk6cfe94kiw7', 'group_join_rejected', 'Permintaan Ditolak', 'Permintaan bergabung ke grup UKM Web Development ditolak.', '{\"groupId\":\"cmn6yzacl0005tk6gm1r9c0iq\",\"groupName\":\"UKM Web Development\"}', 1, '2026-03-26 06:12:08.636'),
('cmn72sdc50003tk0g6qkexk2z', 'cmn6f6iwx0001tk6ccol99g2t', 'group_join_request', 'Permintaan Bergabung Grup', 'Ujang Supriatna ingin bergabung dengan grup UKM Web Development', '{\"groupId\":\"cmn6yzacl0005tk6gm1r9c0iq\",\"groupName\":\"UKM Web Development\",\"requestId\":\"cmn719k940001tkawvokzbzvu\",\"userId\":\"cmn6f43fv0000tk6cfe94kiw7\",\"userName\":\"Ujang Supriatna\"}', 1, '2026-03-26 06:12:29.957'),
('cmn72sqbq0007tk0ggnjycpul', 'cmn6f43fv0000tk6cfe94kiw7', 'group_join_approved', 'Permintaan Diterima', 'Permintaan bergabung ke grup UKM Web Development telah disetujui!', '{\"groupId\":\"cmn6yzacl0005tk6gm1r9c0iq\",\"groupName\":\"UKM Web Development\"}', 1, '2026-03-26 06:12:46.790'),
('cmn73eqsm0000tkl0otzllrjb', 'cmn6f6iwx0001tk6ccol99g2t', 'group_join_request', 'Permintaan Bergabung Grup', 'Ujang Supriatna ingin bergabung dengan grup UKM Web Development', '{\"groupId\":\"cmn6yzacl0005tk6gm1r9c0iq\",\"groupName\":\"UKM Web Development\",\"requestId\":\"cmn719k940001tkawvokzbzvu\",\"userId\":\"cmn6f43fv0000tk6cfe94kiw7\",\"userName\":\"Ujang Supriatna\"}', 1, '2026-03-26 06:29:53.831'),
('cmn73f2fa0002tkl00t7ciger', 'cmn6f43fv0000tk6cfe94kiw7', 'group_join_rejected', 'Permintaan Ditolak', 'Permintaan bergabung ke grup UKM Web Development ditolak.', '{\"groupId\":\"cmn6yzacl0005tk6gm1r9c0iq\",\"groupName\":\"UKM Web Development\"}', 1, '2026-03-26 06:30:08.903'),
('cmn73f8yg0003tkl0ck560c1c', 'cmn6f6iwx0001tk6ccol99g2t', 'group_join_request', 'Permintaan Bergabung Grup', 'Ujang Supriatna ingin bergabung dengan grup UKM Web Development', '{\"groupId\":\"cmn6yzacl0005tk6gm1r9c0iq\",\"groupName\":\"UKM Web Development\",\"requestId\":\"cmn719k940001tkawvokzbzvu\",\"userId\":\"cmn6f43fv0000tk6cfe94kiw7\",\"userName\":\"Ujang Supriatna\"}', 1, '2026-03-26 06:30:17.368'),
('cmn73fcar0007tkl0inbrymgl', 'cmn6f43fv0000tk6cfe94kiw7', 'group_join_approved', 'Permintaan Diterima', 'Permintaan bergabung ke grup UKM Web Development telah disetujui!', '{\"groupId\":\"cmn6yzacl0005tk6gm1r9c0iq\",\"groupName\":\"UKM Web Development\"}', 1, '2026-03-26 06:30:21.699'),
('cmn73fztn000ctkl00top4xhb', 'cmn6f6iwx0001tk6ccol99g2t', 'group_join_request', 'Permintaan Bergabung Grup', 'Ujang Supriatna ingin bergabung dengan grup UKM Web Development', '{\"groupId\":\"cmn6yzacl0005tk6gm1r9c0iq\",\"groupName\":\"UKM Web Development\",\"requestId\":\"cmn73fztc000btkl0g9e9egrd\",\"userId\":\"cmn6f43fv0000tk6cfe94kiw7\",\"userName\":\"Ujang Supriatna\"}', 1, '2026-03-26 06:30:52.188'),
('cmn73g3wu000gtkl0dubh43f6', 'cmn6f43fv0000tk6cfe94kiw7', 'group_join_approved', 'Permintaan Diterima', 'Permintaan bergabung ke grup UKM Web Development telah disetujui!', '{\"groupId\":\"cmn6yzacl0005tk6gm1r9c0iq\",\"groupName\":\"UKM Web Development\"}', 1, '2026-03-26 06:30:57.486'),
('cmn743s790005tk04ffij5w40', 'user_001', 'friend_request', 'New Friend Request', 'Sifa Sayang Ku sent you a friend request', '{\"fromUserId\":\"cmn6f6iwx0001tk6ccol99g2t\",\"friendshipId\":\"cmn743s700003tk04lvxz35z7\"}', 0, '2026-03-26 06:49:22.053'),
('cmn7ryzq90003tke4vszgxcwi', 'cmn6f6iwx0001tk6ccol99g2t', 'comment', 'Komentar Baru', 'Ujang Supriatna mengomentasi postingan Anda', '{\"fromUserId\":\"cmn6f43fv0000tk6cfe94kiw7\",\"postId\":\"cmn70d99t0001tkb08oxlrvhs\",\"commentId\":\"cmn7ryzp90001tke4x8g9uoou\"}', 1, '2026-03-26 17:57:29.313'),
('cmn7rztg20007tke421ewwt43', 'cmn6f43fv0000tk6cfe94kiw7', 'comment', 'Balasan Komentar', 'Sifa Sayang Ku membalas komentar Anda', '{\"fromUserId\":\"cmn6f6iwx0001tk6ccol99g2t\",\"postId\":\"cmn70d99t0001tkb08oxlrvhs\",\"commentId\":\"cmn7rztfg0005tke4zz6q4ref\",\"parentCommentId\":\"cmn7ryzp90001tke4x8g9uoou\"}', 1, '2026-03-26 17:58:07.826'),
('cmn7s05j2000btke4gb1kohnw', 'cmn6f43fv0000tk6cfe94kiw7', 'comment', 'Balasan Komentar', 'Sifa Sayang Ku membalas komentar Anda', '{\"fromUserId\":\"cmn6f6iwx0001tk6ccol99g2t\",\"postId\":\"cmn70d99t0001tkb08oxlrvhs\",\"commentId\":\"cmn7s05ig0009tke4yiuk5gb4\",\"parentCommentId\":\"cmn7ryzp90001tke4x8g9uoou\"}', 1, '2026-03-26 17:58:23.487'),
('cmn7sff650003tkxwan2l6yu2', 'cmn6f43fv0000tk6cfe94kiw7', 'comment', 'Balasan Komentar', 'Sifa Sayang Ku membalas komentar Anda', '{\"fromUserId\":\"cmn6f6iwx0001tk6ccol99g2t\",\"postId\":\"cmn70d99t0001tkb08oxlrvhs\",\"commentId\":\"cmn7sff0q0001tkxwzd725kyr\",\"parentCommentId\":\"cmn7ryzp90001tke4x8g9uoou\"}', 1, '2026-03-26 18:10:15.821'),
('cmn7smsnz0003tkn8wldx51nt', 'cmn6f6iwx0001tk6ccol99g2t', 'friend_request', 'New Friend Request', 'Ujang Supriatna sent you a friend request', '{\"fromUserId\":\"cmn6f43fv0000tk6cfe94kiw7\",\"friendshipId\":\"cmn7smsne0001tkn8l0rovoow\"}', 1, '2026-03-26 18:15:59.903'),
('cmn7sr2ai0001tke8zyfrl6tz', 'cmn6f43fv0000tk6cfe94kiw7', 'friend_accepted', 'Friend Request Accepted', 'Sifa Sayang Ku accepted your friend request', '{\"friendId\":\"cmn6f6iwx0001tk6ccol99g2t\",\"friendshipId\":\"cmn7smsne0001tkn8l0rovoow\"}', 0, '2026-03-26 18:19:19.002'),
('cmn7teih90007tkrswh1aiwcy', 'cmn6f6iwx0001tk6ccol99g2t', 'comment', 'Komentar Baru', 'Ujang Supriatna mengomentasi postingan Anda', '{\"fromUserId\":\"cmn6f43fv0000tk6cfe94kiw7\",\"postId\":\"cmn7oqf2g0001tkawfifhpqjn\",\"commentId\":\"cmn7teig60005tkrsp1imskix\"}', 1, '2026-03-26 18:37:33.070'),
('cmn7tff73000dtkrspu1j1jf5', 'cmn6f43fv0000tk6cfe94kiw7', 'comment', 'Balasan Komentar', 'Sifa Sayang Ku membalas komentar Anda', '{\"fromUserId\":\"cmn6f6iwx0001tk6ccol99g2t\",\"postId\":\"cmn7oqf2g0001tkawfifhpqjn\",\"commentId\":\"cmn7tff5o000btkrsznpswhri\",\"parentCommentId\":\"cmn7teig60005tkrsp1imskix\"}', 0, '2026-03-26 18:38:15.470'),
('cmn7tgewn000htkrsf38vez5q', 'cmn6f43fv0000tk6cfe94kiw7', 'mention', 'Anda Disebutkan', 'Sifa Sayang Ku menyebut Anda dalam komentar', '{\"fromUserId\":\"cmn6f6iwx0001tk6ccol99g2t\",\"postId\":\"cmn7oqf2g0001tkawfifhpqjn\",\"commentId\":\"cmn7tgevn000ftkrs90ossp6c\"}', 1, '2026-03-26 18:39:01.751'),
('cmn7th77s000ltkrs2waip15h', 'cmn6f6iwx0001tk6ccol99g2t', 'comment', 'Balasan Komentar', 'Ujang Supriatna membalas komentar Anda', '{\"fromUserId\":\"cmn6f43fv0000tk6cfe94kiw7\",\"postId\":\"cmn7oqf2g0001tkawfifhpqjn\",\"commentId\":\"cmn7th76p000jtkrs0g23lseo\",\"parentCommentId\":\"cmn7tgevn000ftkrs90ossp6c\"}', 1, '2026-03-26 18:39:38.440');

-- --------------------------------------------------------

--
-- Struktur dari tabel `portfolios`
--

CREATE TABLE `portfolios` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `images` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `technologies` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `portfolios`
--

INSERT INTO `portfolios` (`id`, `userId`, `title`, `description`, `link`, `images`, `technologies`, `createdAt`, `updatedAt`) VALUES
('cmn6lthbs000htkkwgx29xa5y', 'cmn6f43fv0000tk6cfe94kiw7', 'Socmint Dasboard', 'ppp', 'https://socmint.e-projects.cloud', '[\"https://drive.google.com/file/d/14O2LEjYSddfGqEkoqchROig5nJvwixjR/view?usp=drive_link\"]', '[\"py\"]', '2026-03-25 22:17:28.312', '2026-03-25 22:17:28.312');

-- --------------------------------------------------------

--
-- Struktur dari tabel `posts`
--

CREATE TABLE `posts` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `images` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `visibility` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'public',
  `groupId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `authorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `posts`
--

INSERT INTO `posts` (`id`, `content`, `images`, `location`, `visibility`, `groupId`, `authorId`, `createdAt`, `updatedAt`) VALUES
('cmn70d99t0001tkb08oxlrvhs', 'jshhjdsghjdhskdhkshdk😒', '[\"/uploads/posts/post-1774501465333-18dmge.jpg\"]', NULL, 'public', 'cmn6yzacl0005tk6gm1r9c0iq', 'cmn6f6iwx0001tk6ccol99g2t', '2026-03-26 05:04:45.583', '2026-03-26 05:04:45.583'),
('cmn7oqf2g0001tkawfifhpqjn', 'P', NULL, NULL, 'public', NULL, 'cmn6f6iwx0001tk6ccol99g2t', '2026-03-26 16:26:50.101', '2026-03-26 16:26:50.101');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coverPhoto` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `headline` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `skills` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birthday` datetime(3) DEFAULT NULL,
  `gender` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `name`, `username`, `avatar`, `coverPhoto`, `bio`, `phone`, `address`, `website`, `headline`, `skills`, `birthday`, `gender`, `createdAt`, `updatedAt`) VALUES
('cmn6f43fv0000tk6cfe94kiw7', 'ujangsupriatna@gmail.com', '$2b$12$baHjZbAxUV1MM9nYNDoixeS1oO0BJdfB4lhVh1fcCITGRRUIAdkau', 'Ujang Supriatna', 'admin', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAA', '/uploads/profiles/cover-1774480982835-a721zy.jpg', 'kepo', '082240066466', 'Bandung, Jawa Barat, Indonesia', 'https://jasa.itsacademics.com', 'direktur', '[\"py\"]', NULL, NULL, '2026-03-25 19:09:46.205', '2026-03-25 23:23:05.003'),
('cmn6f6iwx0001tk6ccol99g2t', 'sifa@gmail.com', '$2b$12$pFIwR/2h64PAjPZHkssQn.0l.qvMlin0L/Co1n6DGheIFcz3b4PlC', 'Sifa Sayang Ku', 'sifanurlaila', '/uploads/profiles/avatar-1774490493683-qmtvzd.jpg', NULL, '', '', '', '', 'Fullstack Developer', '[]', NULL, NULL, '2026-03-25 19:11:39.585', '2026-03-26 07:34:29.734'),
('user_001', 'ahmad.fauzi@ikmi.ac.id', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYqVqxqZ', 'Ahmad Fauzi', 'ahmad.fauzi', NULL, NULL, 'Mahasiswa S1 Informatika semester 6', '081234567801', 'Bandung, Jawa Barat', NULL, 'Mahasiswa Informatika IKMI', '[\"JavaScript\",\"Python\",\"MySQL\"]', '2002-05-15 00:00:00.000', 'male', '2026-03-26 02:09:21.000', '2026-03-26 02:09:21.000'),
('user_002', 'siti.nurhaliza@ikmi.ac.id', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYqVqxqZ', 'Siti Nurhaliza', 'siti.nur', NULL, NULL, 'Mahasiswi S1 Sistem Informasi', '081234567802', 'Jakarta Timur', NULL, 'Future Data Analyst', '[\"Excel\",\"SQL\",\"Python\"]', '2003-08-22 00:00:00.000', 'female', '2026-03-26 02:09:21.000', '2026-03-26 02:09:21.000'),
('user_003', 'budi.santoso@ikmi.ac.id', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYqVqxqZ', 'Budi Santoso', 'budi.santoso', NULL, NULL, 'Alumni angkatan 2020', '081234567803', 'Bekasi, Jawa Barat', 'linkedin.com/in/budisantoso', 'Software Developer', '[\"React\",\"Node.js\",\"MongoDB\"]', '2000-01-10 00:00:00.000', 'male', '2026-03-26 02:09:21.000', '2026-03-26 02:09:21.000'),
('user_004', 'dewi.putri@ikmi.ac.id', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYqVqxqZ', 'Dewi Putri Rahayu', 'dewi.putri', NULL, NULL, 'Mahasiswi S1 Informatika semester 4', '081234567804', 'Tangerang, Banten', NULL, 'UI/UX Enthusiast', '[\"Figma\",\"Adobe XD\",\"HTML\"]', '2004-03-25 00:00:00.000', 'female', '2026-03-26 02:09:21.000', '2026-03-26 02:09:21.000'),
('user_005', 'rizky.rahman@ikmi.ac.id', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYqVqxqZ', 'Rizky Rahman', 'rizky.rahman', NULL, NULL, 'Mahasiswa S1 Sistem Informasi semester 6', '081234567805', 'Depok, Jawa Barat', NULL, 'Backend Developer', '[\"PHP\",\"Laravel\",\"MySQL\"]', '2002-11-08 00:00:00.000', 'male', '2026-03-26 02:09:21.000', '2026-03-26 02:09:21.000'),
('user_006', 'rina.marlina@ikmi.ac.id', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYqVqxqZ', 'Rina Marlina', 'rina.marlina', NULL, NULL, 'Mahasiswi S1 Informatika semester 2', '081234567806', 'Bogor, Jawa Barat', NULL, 'Belajar Programming', '[\"HTML\",\"CSS\",\"JavaScript\"]', '2005-07-12 00:00:00.000', 'female', '2026-03-26 02:09:21.000', '2026-03-26 02:09:21.000'),
('user_007', 'dandi.pratama@ikmi.ac.id', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYqVqxqZ', 'Dandi Pratama', 'dandi.pratama', NULL, NULL, 'Mahasiswa S1 Informatika semester 4', '081234567807', 'Cimahi, Jawa Barat', NULL, 'Mobile Developer', '[\"Flutter\",\"Dart\",\"Firebase\"]', '2004-02-28 00:00:00.000', 'male', '2026-03-26 02:09:21.000', '2026-03-26 02:09:21.000'),
('user_008', 'fitri.handayani@ikmi.ac.id', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYqVqxqZ', 'Fitri Handayani', 'fitri.handayani', NULL, NULL, 'Mahasiswi S1 Sistem Informasi semester 4', '081234567808', 'Karawang, Jawa Barat', NULL, 'Business Analyst', '[\"SQL\",\"Power BI\",\"Tableau\"]', '2004-06-30 00:00:00.000', 'female', '2026-03-26 02:09:21.000', '2026-03-26 02:09:21.000'),
('user_009', 'erwin.setiawan@ikmi.ac.id', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYqVqxqZ', 'Erwin Setiawan', 'erwin.setiawan', NULL, NULL, 'Alumni angkatan 2019', '081234567809', 'Jakarta Selatan', 'github.com/erwinsetiawan', 'Full Stack Developer', '[\"React\",\"Express\",\"PostgreSQL\"]', '1999-09-14 00:00:00.000', 'male', '2026-03-26 02:09:21.000', '2026-03-26 02:09:21.000'),
('user_010', 'mayang.sari@ikmi.ac.id', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYqVqxqZ', 'Mayang Sari', 'mayang.sari', NULL, NULL, 'Mahasiswi S1 Informatika semester 6', '081234567810', 'Sukabumi, Jawa Barat', NULL, 'Data Science Enthusiast', '[\"Python\",\"R\",\"TensorFlow\"]', '2002-12-05 00:00:00.000', 'female', '2026-03-26 02:09:21.000', '2026-03-26 02:09:21.000'),
('user_011', 'agung.hidayat@ikmi.ac.id', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYqVqxqZ', 'Agung Hidayat', 'agung.hidayat', NULL, NULL, 'Mahasiswa S1 Sistem Informasi semester 2', '081234567811', 'Cirebon, Jawa Barat', NULL, 'Newbie Programmer', '[\"Java\",\"MySQL\"]', '2005-04-18 00:00:00.000', 'male', '2026-03-26 02:09:21.000', '2026-03-26 02:09:21.000'),
('user_012', 'nisa.aulia@ikmi.ac.id', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYqVqxqZ', 'Nisa Aulia', 'nisa.aulia', NULL, NULL, 'Mahasiswi S1 Informatika semester 4', '081234567812', 'Purwakarta, Jawa Barat', NULL, 'Frontend Developer', '[\"Vue.js\",\"React\",\"Tailwind\"]', '2004-10-20 00:00:00.000', 'female', '2026-03-26 02:09:21.000', '2026-03-26 02:09:21.000'),
('user_013', 'fajar.nugroho@ikmi.ac.id', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYqVqxqZ', 'Fajar Nugroho', 'fajar.nugroho', NULL, NULL, 'Mahasiswa S1 Informatika semester 6', '081234567813', 'Subang, Jawa Barat', NULL, 'DevOps Enthusiast', '[\"Docker\",\"Kubernetes\",\"AWS\"]', '2002-07-08 00:00:00.000', 'male', '2026-03-26 02:09:21.000', '2026-03-26 02:09:21.000'),
('user_014', 'salsa.bila@ikmi.ac.id', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYqVqxqZ', 'Salsa Bila', 'salsa.bila', NULL, NULL, 'Mahasiswi S1 Sistem Informasi semester 6', '081234567814', 'Indramayu, Jawa Barat', NULL, 'IT Consultant', '[\"SAP\",\"Oracle\",\"SQL\"]', '2002-01-25 00:00:00.000', 'female', '2026-03-26 02:09:21.000', '2026-03-26 02:09:21.000'),
('user_015', 'hendra.wijaya@ikmi.ac.id', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYqVqxqZ', 'Hendra Wijaya', 'hendra.wijaya', NULL, NULL, 'Alumni angkatan 2018', '081234567815', 'Jakarta Barat', 'hendrawijaya.com', 'Senior Software Engineer', '[\"Java\",\"Spring Boot\",\"Microservices\"]', '1998-06-11 00:00:00.000', 'male', '2026-03-26 02:09:21.000', '2026-03-26 02:09:21.000'),
('user_demo_001', 'andi@gmail.com', '$2b$10$hashedpassword', 'Andi Pratama', 'andipratama', NULL, NULL, 'Mahasiswa Sistem Informasi', NULL, NULL, NULL, 'Mahasiswa', NULL, NULL, 'male', '2026-03-26 13:47:16.000', '2026-03-26 13:47:16.000'),
('user_demo_002', 'siti@gmail.com', '$2b$10$hashedpassword', 'Siti Nurhaliza', 'sitinur', NULL, NULL, 'Mahasiswi Teknik Informatika', NULL, NULL, NULL, 'Mahasiswi', NULL, NULL, 'female', '2026-03-26 13:47:16.000', '2026-03-26 13:47:16.000'),
('user_demo_003', 'budi@gmail.com', '$2b$10$hashedpassword', 'Budi Santoso', 'budisanto', NULL, NULL, 'Backend Developer', NULL, NULL, NULL, 'Developer', NULL, NULL, 'male', '2026-03-26 13:47:16.000', '2026-03-26 13:47:16.000'),
('user_demo_004', 'dewi@gmail.com', '$2b$10$hashedpassword', 'Dewi Lestari', 'dewilest', NULL, NULL, 'UI/UX Designer', NULL, NULL, NULL, 'Designer', NULL, NULL, 'female', '2026-03-26 13:47:16.000', '2026-03-26 13:47:16.000'),
('user_demo_005', 'rizki@gmail.com', '$2b$10$hashedpassword', 'Rizki Ramadhan', 'rizkirama', NULL, NULL, 'Full Stack Developer', NULL, NULL, NULL, 'Developer', NULL, NULL, 'male', '2026-03-26 13:47:16.000', '2026-03-26 13:47:16.000'),
('user_demo_006', 'mayasari@gmail.com', '$2b$10$hashedpassword', 'Maya Sari', 'mayasari', NULL, NULL, 'Data Analyst', NULL, NULL, NULL, 'Analyst', NULL, NULL, 'female', '2026-03-26 13:47:16.000', '2026-03-26 13:47:16.000'),
('user_demo_007', 'fajar@gmail.com', '$2b$10$hashedpassword', 'Fajar Nugroho', 'fajarnug', NULL, NULL, 'Mobile Developer', NULL, NULL, NULL, 'Developer', NULL, NULL, 'male', '2026-03-26 13:47:16.000', '2026-03-26 13:47:16.000'),
('user_demo_008', 'rina@gmail.com', '$2b$10$hashedpassword', 'Rina Wulandari', 'rinawulan', NULL, NULL, 'Product Manager', NULL, NULL, NULL, 'Manager', NULL, NULL, 'female', '2026-03-26 13:47:16.000', '2026-03-26 13:47:16.000'),
('user_demo_009', 'ahmad@gmail.com', '$2b$10$hashedpassword', 'Ahmad Fauzi', 'ahmadfz', NULL, NULL, 'DevOps Engineer', NULL, NULL, NULL, 'Engineer', NULL, NULL, 'male', '2026-03-26 13:47:16.000', '2026-03-26 13:47:16.000'),
('user_demo_010', 'putri@gmail.com', '$2b$10$hashedpassword', 'Putri Handayani', 'putrihand', NULL, NULL, 'Frontend Developer', NULL, NULL, NULL, 'Developer', NULL, NULL, 'female', '2026-03-26 13:47:16.000', '2026-03-26 13:47:16.000');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `achievements`
--
ALTER TABLE `achievements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `achievements_userId_idx` (`userId`);

--
-- Indeks untuk tabel `api`
--
ALTER TABLE `api`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comments_postId_idx` (`postId`),
  ADD KEY `comments_authorId_idx` (`authorId`),
  ADD KEY `comments_parentId_fkey` (`parentId`);

--
-- Indeks untuk tabel `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `conversation_participants`
--
ALTER TABLE `conversation_participants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `conversation_participants_userId_conversationId_key` (`userId`,`conversationId`),
  ADD KEY `conversation_participants_conversationId_idx` (`conversationId`),
  ADD KEY `conversation_participants_userId_idx` (`userId`);

--
-- Indeks untuk tabel `educations`
--
ALTER TABLE `educations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `educations_userId_idx` (`userId`);

--
-- Indeks untuk tabel `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `events_createdById_idx` (`createdById`),
  ADD KEY `events_startDate_idx` (`startDate`),
  ADD KEY `events_category_idx` (`category`);

--
-- Indeks untuk tabel `event_attendances`
--
ALTER TABLE `event_attendances`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `event_attendances_userId_eventId_key` (`userId`,`eventId`),
  ADD KEY `event_attendances_eventId_idx` (`eventId`),
  ADD KEY `event_attendances_userId_idx` (`userId`);

--
-- Indeks untuk tabel `experiences`
--
ALTER TABLE `experiences`
  ADD PRIMARY KEY (`id`),
  ADD KEY `experiences_userId_idx` (`userId`);

--
-- Indeks untuk tabel `friendships`
--
ALTER TABLE `friendships`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `friendships_userId_friendId_key` (`userId`,`friendId`),
  ADD KEY `friendships_friendId_fkey` (`friendId`);

--
-- Indeks untuk tabel `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `groups_createdById_fkey` (`createdById`);

--
-- Indeks untuk tabel `group_join_requests`
--
ALTER TABLE `group_join_requests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `group_join_requests_userId_groupId_key` (`userId`,`groupId`),
  ADD KEY `group_join_requests_groupId_fkey` (`groupId`);

--
-- Indeks untuk tabel `group_members`
--
ALTER TABLE `group_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `group_members_userId_groupId_key` (`userId`,`groupId`),
  ADD KEY `group_members_groupId_fkey` (`groupId`);

--
-- Indeks untuk tabel `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `likes_userId_postId_key` (`userId`,`postId`),
  ADD UNIQUE KEY `likes_userId_commentId_key` (`userId`,`commentId`),
  ADD KEY `likes_postId_fkey` (`postId`),
  ADD KEY `likes_commentId_fkey` (`commentId`);

--
-- Indeks untuk tabel `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `messages_conversationId_idx` (`conversationId`),
  ADD KEY `messages_senderId_idx` (`senderId`);

--
-- Indeks untuk tabel `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_userId_idx` (`userId`);

--
-- Indeks untuk tabel `portfolios`
--
ALTER TABLE `portfolios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `portfolios_userId_idx` (`userId`);

--
-- Indeks untuk tabel `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `posts_authorId_idx` (`authorId`),
  ADD KEY `posts_groupId_idx` (`groupId`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`),
  ADD UNIQUE KEY `users_username_key` (`username`);

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `achievements`
--
ALTER TABLE `achievements`
  ADD CONSTRAINT `achievements_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `comments` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `comments_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `conversation_participants`
--
ALTER TABLE `conversation_participants`
  ADD CONSTRAINT `conversation_participants_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `conversation_participants_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `educations`
--
ALTER TABLE `educations`
  ADD CONSTRAINT `educations_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `event_attendances`
--
ALTER TABLE `event_attendances`
  ADD CONSTRAINT `event_attendances_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `event_attendances_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `experiences`
--
ALTER TABLE `experiences`
  ADD CONSTRAINT `experiences_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `friendships`
--
ALTER TABLE `friendships`
  ADD CONSTRAINT `friendships_friendId_fkey` FOREIGN KEY (`friendId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `friendships_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `groups_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `group_join_requests`
--
ALTER TABLE `group_join_requests`
  ADD CONSTRAINT `group_join_requests_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `group_join_requests_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `group_members`
--
ALTER TABLE `group_members`
  ADD CONSTRAINT `group_members_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `group_members_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `comments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `messages_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `portfolios`
--
ALTER TABLE `portfolios`
  ADD CONSTRAINT `portfolios_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `posts_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
