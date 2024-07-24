-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 24, 2024 at 12:52 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `moi`
--

-- --------------------------------------------------------

--
-- Table structure for table `auth_group`
--

CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `auth_group_permissions`
--

CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `auth_permission`
--

CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 2, 'add_permission'),
(6, 'Can change permission', 2, 'change_permission'),
(7, 'Can delete permission', 2, 'delete_permission'),
(8, 'Can view permission', 2, 'view_permission'),
(9, 'Can add group', 3, 'add_group'),
(10, 'Can change group', 3, 'change_group'),
(11, 'Can delete group', 3, 'delete_group'),
(12, 'Can view group', 3, 'view_group'),
(13, 'Can add user', 4, 'add_user'),
(14, 'Can change user', 4, 'change_user'),
(15, 'Can delete user', 4, 'delete_user'),
(16, 'Can view user', 4, 'view_user'),
(17, 'Can add content type', 5, 'add_contenttype'),
(18, 'Can change content type', 5, 'change_contenttype'),
(19, 'Can delete content type', 5, 'delete_contenttype'),
(20, 'Can view content type', 5, 'view_contenttype'),
(21, 'Can add session', 6, 'add_session'),
(22, 'Can change session', 6, 'change_session'),
(23, 'Can delete session', 6, 'delete_session'),
(24, 'Can view session', 6, 'view_session'),
(25, 'Can add user', 7, 'add_user'),
(26, 'Can change user', 7, 'change_user'),
(27, 'Can delete user', 7, 'delete_user'),
(28, 'Can view user', 7, 'view_user'),
(29, 'Can add employee', 8, 'add_employee'),
(30, 'Can change employee', 8, 'change_employee'),
(31, 'Can delete employee', 8, 'delete_employee'),
(32, 'Can view employee', 8, 'view_employee'),
(33, 'Can add car plate', 9, 'add_carplate'),
(34, 'Can change car plate', 9, 'change_carplate'),
(35, 'Can delete car plate', 9, 'delete_carplate'),
(36, 'Can view car plate', 9, 'view_carplate'),
(37, 'Can add wrong parking', 10, 'add_wrongparking'),
(38, 'Can change wrong parking', 10, 'change_wrongparking'),
(39, 'Can delete wrong parking', 10, 'delete_wrongparking'),
(40, 'Can view wrong parking', 10, 'view_wrongparking'),
(41, 'Can add drone', 11, 'add_drone'),
(42, 'Can change drone', 11, 'change_drone'),
(43, 'Can delete drone', 11, 'delete_drone'),
(44, 'Can view drone', 11, 'view_drone'),
(45, 'Can add detection log', 9, 'add_detectionlog'),
(46, 'Can change detection log', 9, 'change_detectionlog'),
(47, 'Can delete detection log', 9, 'delete_detectionlog'),
(48, 'Can view detection log', 9, 'view_detectionlog');

-- --------------------------------------------------------

--
-- Table structure for table `auth_user`
--

CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `auth_user`
--

INSERT INTO `auth_user` (`id`, `password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `email`, `is_staff`, `is_active`, `date_joined`) VALUES
(2, 'pbkdf2_sha256$600000$0pbNDOK8lVIXnjRGesqydZ$LOg3THF1c+C7KzbykWJEOmbcMmJXCZKTWcixg8rjuEg=', '2024-07-24 05:27:33.868562', 0, 'admin@gmail.com', 'Admin', '', 'admin@gmail.com', 0, 1, '2024-06-03 08:02:10.417821');

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_groups`
--

CREATE TABLE `auth_user_groups` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_user_permissions`
--

CREATE TABLE `auth_user_user_permissions` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `django_admin_log`
--

CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `django_content_type`
--

CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(1, 'admin', 'logentry'),
(3, 'auth', 'group'),
(2, 'auth', 'permission'),
(4, 'auth', 'user'),
(5, 'contenttypes', 'contenttype'),
(9, 'moiapp', 'detectionlog'),
(11, 'moiapp', 'drone'),
(8, 'moiapp', 'employee'),
(7, 'moiapp', 'user'),
(10, 'moiapp', 'wrongparking'),
(6, 'sessions', 'session');

-- --------------------------------------------------------

--
-- Table structure for table `django_migrations`
--

CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2024-06-03 07:04:32.997057'),
(2, 'auth', '0001_initial', '2024-06-03 07:04:33.232408'),
(3, 'admin', '0001_initial', '2024-06-03 07:04:33.286463'),
(4, 'admin', '0002_logentry_remove_auto_add', '2024-06-03 07:04:33.292464'),
(5, 'admin', '0003_logentry_add_action_flag_choices', '2024-06-03 07:04:33.300466'),
(6, 'contenttypes', '0002_remove_content_type_name', '2024-06-03 07:04:33.338120'),
(7, 'auth', '0002_alter_permission_name_max_length', '2024-06-03 07:04:33.368214'),
(8, 'auth', '0003_alter_user_email_max_length', '2024-06-03 07:04:33.379266'),
(9, 'auth', '0004_alter_user_username_opts', '2024-06-03 07:04:33.389268'),
(10, 'auth', '0005_alter_user_last_login_null', '2024-06-03 07:04:33.419818'),
(11, 'auth', '0006_require_contenttypes_0002', '2024-06-03 07:04:33.422821'),
(12, 'auth', '0007_alter_validators_add_error_messages', '2024-06-03 07:04:33.429136'),
(13, 'auth', '0008_alter_user_username_max_length', '2024-06-03 07:04:33.441135'),
(14, 'auth', '0009_alter_user_last_name_max_length', '2024-06-03 07:04:33.454551'),
(15, 'auth', '0010_alter_group_name_max_length', '2024-06-03 07:04:33.469572'),
(16, 'auth', '0011_update_proxy_permissions', '2024-06-03 07:04:33.476740'),
(17, 'auth', '0012_alter_user_first_name_max_length', '2024-06-03 07:04:33.492741'),
(18, 'moiapp', '0001_initial', '2024-06-03 07:04:33.496760'),
(19, 'sessions', '0001_initial', '2024-06-03 07:04:33.517213'),
(20, 'moiapp', '0002_employee_delete_user', '2024-06-03 08:21:22.191860'),
(21, 'moiapp', '0003_carplate_wrongparking', '2024-06-10 09:15:07.800076'),
(22, 'moiapp', '0004_drone', '2024-06-10 11:45:58.323705'),
(23, 'moiapp', '0005_carplate_car_color_carplate_car_model', '2024-06-27 07:51:27.463344'),
(24, 'moiapp', '0006_alter_carplate', '2024-07-09 12:27:17.802387');

-- --------------------------------------------------------

--
-- Table structure for table `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `django_session`
--

INSERT INTO `django_session` (`session_key`, `session_data`, `expire_date`) VALUES
('2m28wu5ubnpikjmyyyj1atumtz9e4492', '.eJxVjDsOwjAQBe_iGln-rrWU9JzBsr1rHECOFCcV4u4QKQW0b2beS8S0rS1ug5c4kTgLI06_W07lwX0HdE_9Nssy93WZstwVedAhrzPx83K4fwctjfatHetgyBNaXxWiZue4kAneKLCViND7zBqshWCrYs7JKGRw6AoxgHh_ANWkN7U:1sH1Om:pzw0CLwvQ92CYEwc67eGVjBIrpsUgZhFLjMvalDyFE0', '2024-06-25 13:18:52.521920'),
('2srh0bh2p4qklszp9in3nkmb6xps0hbp', '.eJxVjDsOwjAQBe_iGln-rrWU9JzBsr1rHECOFCcV4u4QKQW0b2beS8S0rS1ug5c4kTgLI06_W07lwX0HdE_9Nssy93WZstwVedAhrzPx83K4fwctjfatHetgyBNaXxWiZue4kAneKLCViND7zBqshWCrYs7JKGRw6AoxgHh_ANWkN7U:1sTfG2:2L009Zuxx24DoXdock4Syv7odR5BindpwjLElzDWPYM', '2024-07-30 10:18:06.199694'),
('90riboek38leuv9ajs01wt0z5tts1y0k', 'e30:1sE2Wp:alUfW7RDnFUtwpJiLb0Z-92p9qyQZsswZiel-zjeirg', '2024-06-17 07:54:51.520294'),
('bfh4wv4dpshe0jabkgkd8b5k99mxw1jf', '.eJxVjDsOwjAQBe_iGln-rrWU9JzBsr1rHECOFCcV4u4QKQW0b2beS8S0rS1ug5c4kTgLI06_W07lwX0HdE_9Nssy93WZstwVedAhrzPx83K4fwctjfatHetgyBNaXxWiZue4kAneKLCViND7zBqshWCrYs7JKGRw6AoxgHh_ANWkN7U:1sOZCh:Bce-t7O0b9NE5RR8pi7lT3mM3DoVPwrhlN6kFa_6bP4', '2024-07-16 08:49:35.063495'),
('cvviofb17d06oc8l7634o5o1vcl0tq0y', '.eJxVjDsOwjAQBe_iGln-rrWU9JzBsr1rHECOFCcV4u4QKQW0b2beS8S0rS1ug5c4kTgLI06_W07lwX0HdE_9Nssy93WZstwVedAhrzPx83K4fwctjfatHetgyBNaXxWiZue4kAneKLCViND7zBqshWCrYs7JKGRw6AoxgHh_ANWkN7U:1sLJAo:dQ_zgNrH_5LDQxWzQ6WhPGUW221stlHZfnpDcV46ad4', '2024-07-07 09:06:10.442947'),
('ehsvayltnm54sdvwkoiadqhhtrvfhc7c', '.eJxVjDsOwjAQBe_iGln-rrWU9JzBsr1rHECOFCcV4u4QKQW0b2beS8S0rS1ug5c4kTgLI06_W07lwX0HdE_9Nssy93WZstwVedAhrzPx83K4fwctjfatHetgyBNaXxWiZue4kAneKLCViND7zBqshWCrYs7JKGRw6AoxgHh_ANWkN7U:1sObNn:vnPthayXkYKgbNT8GtUIDQ9z-jFjk7tSBgaf9_vX8qY', '2024-07-16 11:09:11.745282'),
('f5jlhe4zd7em9t1tzc5w82lw2gbj1lgt', '.eJxVjDsOwjAQBe_iGln-rrWU9JzBsr1rHECOFCcV4u4QKQW0b2beS8S0rS1ug5c4kTgLI06_W07lwX0HdE_9Nssy93WZstwVedAhrzPx83K4fwctjfatHetgyBNaXxWiZue4kAneKLCViND7zBqshWCrYs7JKGRw6AoxgHh_ANWkN7U:1sUK46:OrJPWGMAQlTb0_y_NJIMyaueNz7nz8xacjEjpNLK2cU', '2024-08-01 05:52:30.372891'),
('fb08elhoiode7kbhcgz2c41h01xoj522', '.eJxVjDsOwjAQBe_iGln-rrWU9JzBsr1rHECOFCcV4u4QKQW0b2beS8S0rS1ug5c4kTgLI06_W07lwX0HdE_9Nssy93WZstwVedAhrzPx83K4fwctjfatHetgyBNaXxWiZue4kAneKLCViND7zBqshWCrYs7JKGRw6AoxgHh_ANWkN7U:1sHhFB:GUh3wQXc3yzdR7grqC1rH5xGIvXtUd1rr3gJ_yGVXN0', '2024-06-27 09:59:45.250989'),
('ft3vfzepztzmwl8nfdt7qklekgrpwmwx', '.eJxVjDsOwjAQBe_iGln-rrWU9JzBsr1rHECOFCcV4u4QKQW0b2beS8S0rS1ug5c4kTgLI06_W07lwX0HdE_9Nssy93WZstwVedAhrzPx83K4fwctjfatHetgyBNaXxWiZue4kAneKLCViND7zBqshWCrYs7JKGRw6AoxgHh_ANWkN7U:1sWUXF:iZVzPCGHmMsp1ocZ_zf_tCTxq-jrMlqf9dHXTrTApS0', '2024-08-07 05:27:33.875565'),
('hgf15nq13h3q6wi37g18fcl85st9kz7y', '.eJxVjDsOwjAQBe_iGln-rrWU9JzBsr1rHECOFCcV4u4QKQW0b2beS8S0rS1ug5c4kTgLI06_W07lwX0HdE_9Nssy93WZstwVedAhrzPx83K4fwctjfatHetgyBNaXxWiZue4kAneKLCViND7zBqshWCrYs7JKGRw6AoxgHh_ANWkN7U:1sTfPS:-HykgmuANjxZAYQBtxg2dC6yHl9Rqkn0HHQzFJctrkQ', '2024-07-30 10:27:50.020989'),
('hqoe7syl8tipv7matgzxrntylatrkz02', '.eJxVjDsOwjAQBe_iGln-rrWU9JzBsr1rHECOFCcV4u4QKQW0b2beS8S0rS1ug5c4kTgLI06_W07lwX0HdE_9Nssy93WZstwVedAhrzPx83K4fwctjfatHetgyBNaXxWiZue4kAneKLCViND7zBqshWCrYs7JKGRw6AoxgHh_ANWkN7U:1sODQC:VrAx33mLFPSNVzEXJkMbbYnEvhYnZezMasmHGU0T-QU', '2024-07-15 09:34:04.947819'),
('jpxxwg0xdluxozlqnaqynmzp9oqw2yyj', '.eJxVjDsOwjAQBe_iGln-rrWU9JzBsr1rHECOFCcV4u4QKQW0b2beS8S0rS1ug5c4kTgLI06_W07lwX0HdE_9Nssy93WZstwVedAhrzPx83K4fwctjfatHetgyBNaXxWiZue4kAneKLCViND7zBqshWCrYs7JKGRw6AoxgHh_ANWkN7U:1sTzML:881L3Z0xnJG2Lnv-Jvr_bQM5np_hG4obV5gTc6DF8Ck', '2024-07-31 07:45:57.189157'),
('line7pkvpx3zy7r0gy9txhb2lm6wt0qp', '.eJxVjDsOwjAQBe_iGln-rrWU9JzBsr1rHECOFCcV4u4QKQW0b2beS8S0rS1ug5c4kTgLI06_W07lwX0HdE_9Nssy93WZstwVedAhrzPx83K4fwctjfatHetgyBNaXxWiZue4kAneKLCViND7zBqshWCrYs7JKGRw6AoxgHh_ANWkN7U:1sHiWg:pGcscMiuwv9EIUPlIUq8FEtEOdMCIZnNe6_qgjSR-EQ', '2024-06-27 11:21:54.316635'),
('ltmkgsjt7tahe3n2w4so01mykptgufo3', '.eJxVjDsOwjAQBe_iGln-rrWU9JzBsr1rHECOFCcV4u4QKQW0b2beS8S0rS1ug5c4kTgLI06_W07lwX0HdE_9Nssy93WZstwVedAhrzPx83K4fwctjfatHetgyBNaXxWiZue4kAneKLCViND7zBqshWCrYs7JKGRw6AoxgHh_ANWkN7U:1sPFAu:F4EChyVLsYJKcaEapeiqWSAirWVouJq7QFkmu0sUbL4', '2024-07-18 05:38:32.290812'),
('nspwlxx76k059i4hc79k83ttsa7y7p6r', 'e30:1sE2Vd:4_0NPU3oJNYtP9YnpN1LGwHzigHHcxbGu0bao0SlYZ4', '2024-06-17 07:53:37.835127'),
('tmn93v8jqqpros2ppv5ntxy2h92v2dlt', 'e30:1sE2T8:JMc63oRFNC5qZ02V7d9AzJHLs8awZX1m_VwbWLg3b-k', '2024-06-17 07:51:02.467872'),
('yacxx6dph3pifh4v39qumgysjihjw5qs', '.eJxVjDsOwjAQBe_iGln-rrWU9JzBsr1rHECOFCcV4u4QKQW0b2beS8S0rS1ug5c4kTgLI06_W07lwX0HdE_9Nssy93WZstwVedAhrzPx83K4fwctjfatHetgyBNaXxWiZue4kAneKLCViND7zBqshWCrYs7JKGRw6AoxgHh_ANWkN7U:1sKBVF:cBci_91PEwbbpK9PPi8F-Rmap2MzmC-y93wS7DMcbL8', '2024-07-04 06:42:37.094799');

-- --------------------------------------------------------

--
-- Table structure for table `moiapp_carplate`
--

CREATE TABLE `moiapp_carplate` (
  `id` bigint(20) NOT NULL,
  `owner_name` varchar(100) NOT NULL,
  `plate_text` varchar(20) NOT NULL,
  `car_model` varchar(300) NOT NULL,
  `car_color` varchar(30) NOT NULL,
  `status` varchar(10) NOT NULL,
  `time` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `moiapp_detectionlog`
--

CREATE TABLE `moiapp_detectionlog` (
  `id` bigint(20) NOT NULL,
  `emp_id` bigint(20) NOT NULL DEFAULT 14,
  `plate_text` varchar(20) NOT NULL,
  `time` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `car_color` varchar(30) NOT NULL,
  `car_model` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `moiapp_detectionlog`
--

INSERT INTO `moiapp_detectionlog` (`id`, `emp_id`, `plate_text`, `time`, `car_color`, `car_model`) VALUES
(10, 1, 'ZSE-6666', '2024-07-21 22:19:29.000000', 'silver', 'gmc'),
(11, 1, 'ZSE-8888', '2024-07-23 22:17:29.000000', 'silver', 'gmc'),
(12, 1, 'ZSE-9999', '2024-07-17 22:16:29.000000', 'silver', 'gmc'),
(14, 2, 'ZSE-6666', '2024-07-21 22:15:29.000000', 'silver', 'gmc'),
(15, 3, 'ZSE-699', '2024-07-23 11:18:29.000000', 'silver', 'gmc'),
(16, 1, 'ZSE-9999', '2024-07-24 00:00:00.000000', 'silver', 'gmc'),
(17, 4, 'ZSE-6666', '1900-01-24 00:00:00.000000', 'silver', 'gmc'),
(18, 1, 'ZSE-8888', '2024-07-24 00:00:00.000000', 'silver', 'gmc'),
(19, 14, 'ZSE-6666', '2024-07-23 07:44:13.000000', 'silver', 'gmc'),
(20, 1, 'ZSE-6666', '2024-07-21 22:19:29.000000', 'silver', 'gmc'),
(21, 1, 'ZSE-8888', '2024-07-23 22:17:29.000000', 'silver', 'gmc'),
(22, 1, 'ZSE-9999', '2024-07-17 22:16:29.000000', 'silver', 'gmc'),
(23, 2, 'ZSE-6666', '2024-07-21 22:15:29.000000', 'silver', 'gmc'),
(24, 3, 'ZSE-699', '2024-07-23 11:18:29.000000', 'silver', 'gmc'),
(25, 1, 'ZSE-9999', '2024-07-24 00:00:00.000000', 'silver', 'gmc'),
(26, 4, 'ZSE-6666', '2024-01-24 00:00:00.000000', 'silver', 'gmc'),
(27, 1, 'ZSE-8888', '2024-07-24 00:00:00.000000', 'silver', 'gmc'),
(28, 14, 'ZSE-6666', '2024-07-24 07:41:13.000000', 'silver', 'gmc'),
(29, 1, 'ZSE-6666', '2024-07-21 22:19:29.000000', 'silver', 'gmc'),
(30, 1, 'ZSE-8888', '2024-07-23 22:17:29.000000', 'silver', 'gmc'),
(31, 1, 'ZSE-9999', '2024-07-17 22:16:29.000000', 'silver', 'gmc'),
(32, 2, 'ZSE-6666', '2024-07-21 22:15:29.000000', 'silver', 'gmc'),
(33, 3, 'ZSE-699', '2024-07-23 11:18:29.000000', 'silver', 'gmc'),
(34, 1, 'ZSE-9999', '2024-07-24 02:08:22.000000', 'silver', 'gmc'),
(35, 4, 'ZSE-6666', '2024-07-24 11:29:47.000000', 'silver', 'gmc'),
(36, 1, 'ZSE-8888', '2024-07-24 00:00:00.000000', 'silver', 'gmc'),
(37, 14, 'ZSE-6666', '2024-07-24 07:46:13.000000', 'silver', 'gmc'),
(38, 1, 'ZSE-6666', '2024-07-21 22:19:29.000000', 'silver', 'gmc'),
(39, 1, 'ZSE-8888', '2024-07-23 22:17:29.000000', 'silver', 'gmc'),
(40, 1, 'ZSE-9999', '2024-07-17 22:16:29.000000', 'silver', 'gmc'),
(41, 2, 'ZSE-6666', '2024-07-21 22:15:29.000000', 'silver', 'gmc'),
(42, 3, 'ZSE-699', '2024-07-23 11:18:29.000000', 'silver', 'gmc'),
(43, 1, 'ZSE-9999', '2024-07-24 00:00:00.000000', 'silver', 'gmc'),
(44, 4, 'ZSE-6666', '1900-01-24 00:00:00.000000', 'silver', 'gmc'),
(45, 1, 'ZSE-8888', '2024-07-24 00:00:00.000000', 'silver', 'gmc'),
(46, 14, 'ZSE-6666', '2024-07-24 07:41:13.000000', 'silver', 'gmc'),
(47, 2, 'ZSE-6666', '2024-07-21 22:15:29.000000', 'silver', 'gmc'),
(48, 3, 'ZSE-699', '2024-07-23 11:18:29.000000', 'silver', 'gmc'),
(49, 1, 'ZSE-9999', '2024-07-24 00:00:00.000000', 'silver', 'gmc'),
(50, 4, 'ZSE-6666', '1900-01-24 00:00:00.000000', 'silver', 'gmc'),
(51, 1, 'ZSE-8888', '2024-07-24 00:00:00.000000', 'silver', 'gmc'),
(52, 14, 'ZSE-6666', '2024-07-24 07:41:13.000000', 'silver', 'gmc'),
(53, 1, 'ZSE-6666', '2024-07-21 22:19:29.000000', 'silver', 'gmc'),
(54, 1, 'ZSE-8888', '2024-07-23 22:17:29.000000', 'silver', 'gmc'),
(55, 1, 'ZSE-9999', '2024-07-17 22:16:29.000000', 'silver', 'gmc'),
(56, 2, 'ZSE-6666', '2024-07-21 22:15:29.000000', 'silver', 'gmc'),
(57, 3, 'ZSE-699', '2024-07-23 11:18:29.000000', 'silver', 'gmc'),
(58, 1, 'ZSE-9999', '2024-07-24 00:00:00.000000', 'silver', 'gmc'),
(59, 4, 'ZSE-6666', '1900-01-24 00:00:00.000000', 'silver', 'gmc'),
(60, 1, 'ZSE-8888', '2024-07-24 00:00:00.000000', 'silver', 'gmc'),
(61, 14, 'ZSE-6666', '2024-07-24 07:41:13.000000', 'silver', 'gmc'),
(62, 1, 'ZSE-6666', '2024-07-21 22:19:29.000000', 'silver', 'gmc'),
(63, 1, 'ZSE-8888', '2024-07-23 22:17:29.000000', 'silver', 'gmc'),
(64, 1, 'ZSE-9999', '2024-07-17 22:16:29.000000', 'silver', 'gmc'),
(65, 2, 'ZSE-6666', '2024-07-21 22:15:29.000000', 'silver', 'gmc'),
(66, 3, 'ZSE-699', '2024-07-23 11:18:29.000000', 'silver', 'gmc'),
(67, 1, 'ZSE-9999', '2024-07-24 00:00:00.000000', 'silver', 'gmc'),
(68, 4, 'ZSE-6666', '2024-01-24 00:00:00.000000', 'silver', 'gmc'),
(69, 1, 'ZSE-8888', '2024-07-24 00:00:00.000000', 'silver', 'gmc'),
(70, 14, 'ZSE-6666', '2024-07-24 07:41:13.000000', 'silver', 'gmc'),
(71, 1, 'ZSE-6666', '2024-07-21 22:19:29.000000', 'silver', 'gmc'),
(72, 1, 'ZSE-8888', '2024-07-23 22:17:29.000000', 'silver', 'gmc'),
(73, 1, 'ZSE-9999', '2024-07-17 22:16:29.000000', 'silver', 'gmc'),
(74, 2, 'ZSE-6666', '2024-07-21 22:15:29.000000', 'silver', 'gmc'),
(75, 3, 'ZSE-699', '2024-07-23 11:18:29.000000', 'silver', 'gmc'),
(76, 1, 'ZSE-9999', '2024-07-24 00:00:00.000000', 'silver', 'gmc'),
(77, 4, 'ZSE-6666', '2024-01-24 00:00:00.000000', 'silver', 'gmc'),
(78, 1, 'ZSE-6666', '2024-07-21 22:19:29.000000', 'silver', 'gmc'),
(79, 1, 'ZSE-8888', '2024-07-23 22:17:29.000000', 'silver', 'gmc'),
(80, 1, 'ZSE-9999', '2024-07-17 22:16:29.000000', 'silver', 'gmc'),
(81, 2, 'ZSE-6666', '2024-07-21 22:15:29.000000', 'silver', 'gmc'),
(82, 3, 'ZSE-699', '2024-07-23 11:18:29.000000', 'silver', 'gmc'),
(83, 1, 'ZSE-9999', '2024-07-24 00:00:00.000000', 'silver', 'gmc'),
(84, 4, 'ZSE-6666', '1900-01-24 00:00:00.000000', 'silver', 'gmc'),
(85, 1, 'ZSE-8888', '2024-07-24 00:00:00.000000', 'silver', 'gmc'),
(86, 14, 'ZSE-6666', '2024-07-24 07:41:13.000000', 'silver', 'gmc'),
(87, 1, 'ZSE-6666', '2024-07-21 22:19:29.000000', 'silver', 'gmc'),
(88, 1, 'ZSE-8888', '2024-07-23 22:17:29.000000', 'silver', 'gmc'),
(89, 1, 'ZSE-9999', '2024-07-17 22:16:29.000000', 'silver', 'gmc'),
(90, 2, 'ZSE-6666', '2024-07-21 22:15:29.000000', 'silver', 'gmc'),
(91, 3, 'ZSE-699', '2024-07-24 00:00:00.000000', 'silver', 'gmc'),
(92, 1, 'ZSE-9999', '2024-07-24 00:00:00.000000', 'silver', 'gmc'),
(93, 4, 'ZSE-6666', '2024-01-24 00:00:00.000000', 'silver', 'gmc'),
(94, 1, 'ZSE-8888', '2024-07-24 00:00:00.000000', 'silver', 'gmc'),
(95, 14, 'ZSE-6666', '2024-07-24 07:41:13.000000', 'silver', 'gmc'),
(96, 1, 'ZSE-6666', '2024-07-21 22:19:29.000000', 'silver', 'gmc'),
(97, 1, 'ZSE-8888', '2024-07-23 22:17:29.000000', 'silver', 'gmc'),
(98, 1, 'ZSE-9999', '2024-07-17 22:16:29.000000', 'silver', 'gmc'),
(99, 2, 'ZSE-6666', '2024-07-21 22:15:29.000000', 'silver', 'gmc'),
(101, 1, 'ZSE-9999', '2024-07-24 00:00:00.000000', 'silver', 'gmc'),
(102, 4, 'ZSE-6666', '2024-01-24 00:00:00.000000', 'silver', 'gmc');

-- --------------------------------------------------------

--
-- Table structure for table `moiapp_drone`
--

CREATE TABLE `moiapp_drone` (
  `id` bigint(20) NOT NULL,
  `total` varchar(100) NOT NULL,
  `status` varchar(20) NOT NULL,
  `time` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `moiapp_drone`
--

INSERT INTO `moiapp_drone` (`id`, `total`, `status`, `time`) VALUES
(1, '254', 'Heavy', '2024-07-21 13:27:37.000000'),
(2, '100', 'Moderate', '2024-07-21 14:27:37.000000'),
(3, '150', 'Moderate', '2024-07-11 15:27:37.000000'),
(4, '280', 'Light', '2024-07-11 15:41:29.000000'),
(5, '300', 'Moderate', '2024-07-11 15:41:29.000000'),
(6, '80', 'Light', '2024-07-04 07:47:37.000000'),
(8, '65', 'Heavy', '2024-07-04 08:19:27.320234'),
(9, '65', 'Heavy', '2024-07-04 08:20:02.442225'),
(10, '65', 'Heavy', '2024-07-04 08:20:36.358021'),
(11, '65', 'Heavy', '2024-07-04 08:20:59.898292');

-- --------------------------------------------------------

--
-- Table structure for table `moiapp_employee`
--

CREATE TABLE `moiapp_employee` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `position` varchar(100) NOT NULL,
  `numplate` varchar(100) NOT NULL,
  `status` varchar(10) NOT NULL,
  `image` varchar(250) NOT NULL,
  `time` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `moiapp_employee`
--

INSERT INTO `moiapp_employee` (`id`, `name`, `position`, `numplate`, `status`, `image`, `time`) VALUES
(1, 'Dr Elie', 'Chief Executive Officer', 'CD-4332', 'white', 'Dr_Elie.jpg', '2024-07-15 11:18:29.000000'),
(2, 'Sarah AlTujjar', 'Software Developer', 'CD-4332', 'black', 'Sarah_AlTujjar.jpg', '2024-07-15 08:34:49.000000'),
(3, 'Mohammad Bilal Anwar', 'Web Developer', 'CD-4332', 'black', 'Bilal_Anwar.jpg', '2024-07-15 08:34:49.000000'),
(4, 'Anthony Najem', 'Sales Representer', 'CD-3333', 'white', 'Anthony_Najem.jpg', '2024-07-15 08:34:49.000000'),
(14, 'Unknow', 'unknown', 'unknown', 'unknown', 'unknown.jpg', '2024-07-15 11:18:29.000000'),
(15, 'Dr Elie', 'Chief Executive Officer', 'CD-4332', 'white', 'Dr_Elie.jpg', '2024-07-15 11:18:29.000000'),
(16, 'Sarah AlTujjar', 'Software Developer', 'CD-4332', 'black', 'Sarah_AlTujjar.jpg', '2024-07-15 08:34:49.000000'),
(17, 'Mohammad Bilal Anwar', 'Web Developer', 'CD-4332', 'black', 'Bilal_Anwar.jpg', '2024-07-15 08:34:49.000000'),
(18, 'Anthony Najem', 'Sales Representer', 'CD-3333', 'white', 'Anthony_Najem.jpg', '2024-07-15 08:34:49.000000'),
(19, 'Unknow', 'unknown', 'unknown', 'unknown', 'unknown.jpg', '2024-07-15 11:18:29.000000'),
(20, 'Dr Elie', 'Chief Executive Officer', 'CD-4332', 'white', 'Dr_Elie.jpg', '2024-07-15 11:18:29.000000'),
(21, 'Sarah AlTujjar', 'Software Developer', 'CD-4332', 'black', 'Sarah_AlTujjar.jpg', '2024-07-15 08:34:49.000000'),
(22, 'Mohammad Bilal Anwar', 'Web Developer', 'CD-4332', 'black', 'Bilal_Anwar.jpg', '2024-07-15 08:34:49.000000'),
(23, 'Anthony Najem', 'Sales Representer', 'CD-3333', 'white', 'Anthony_Najem.jpg', '2024-07-15 08:34:49.000000'),
(24, 'Unknow', 'unknown', 'unknown', 'unknown', 'unknown.jpg', '2024-07-15 11:18:29.000000'),
(25, 'Dr Elie', 'Chief Executive Officer', 'CD-4332', 'white', 'Dr_Elie.jpg', '2024-07-15 11:18:29.000000'),
(26, 'Sarah AlTujjar', 'Software Developer', 'CD-4332', 'black', 'Sarah_AlTujjar.jpg', '2024-07-15 08:34:49.000000'),
(27, 'Mohammad Bilal Anwar', 'Web Developer', 'CD-4332', 'black', 'Bilal_Anwar.jpg', '2024-07-15 08:34:49.000000'),
(28, 'Anthony Najem', 'Sales Representer', 'CD-3333', 'white', 'Anthony_Najem.jpg', '2024-07-15 08:34:49.000000'),
(29, 'Unknow', 'unknown', 'unknown', 'unknown', 'unknown.jpg', '2024-07-15 11:18:29.000000'),
(30, 'Dr Elie', 'Chief Executive Officer', 'CD-4332', 'white', 'Dr_Elie.jpg', '2024-07-15 11:18:29.000000'),
(31, 'Sarah AlTujjar', 'Software Developer', 'CD-4332', 'black', 'Sarah_AlTujjar.jpg', '2024-07-15 08:34:49.000000'),
(32, 'Mohammad Bilal Anwar', 'Web Developer', 'CD-4332', 'black', 'Bilal_Anwar.jpg', '2024-07-15 08:34:49.000000'),
(33, 'Anthony Najem', 'Sales Representer', 'CD-3333', 'white', 'Anthony_Najem.jpg', '2024-07-15 08:34:49.000000'),
(34, 'Unknow', 'unknown', 'unknown', 'unknown', 'unknown.jpg', '2024-07-15 11:18:29.000000'),
(35, 'Dr Elie', 'Chief Executive Officer', 'CD-4332', 'white', 'Dr_Elie.jpg', '2024-07-15 11:18:29.000000'),
(36, 'Sarah AlTujjar', 'Software Developer', 'CD-4332', 'black', 'Sarah_AlTujjar.jpg', '2024-07-15 08:34:49.000000'),
(37, 'Mohammad Bilal Anwar', 'Web Developer', 'CD-4332', 'black', 'Bilal_Anwar.jpg', '2024-07-15 08:34:49.000000'),
(38, 'Anthony Najem', 'Sales Representer', 'CD-3333', 'white', 'Anthony_Najem.jpg', '2024-07-15 08:34:49.000000'),
(39, 'Unknow', 'unknown', 'unknown', 'unknown', 'unknown.jpg', '2024-07-15 11:18:29.000000'),
(40, 'Dr Elie', 'Chief Executive Officer', 'CD-4332', 'white', 'Dr_Elie.jpg', '2024-07-15 11:18:29.000000'),
(41, 'Sarah AlTujjar', 'Software Developer', 'CD-4332', 'black', 'Sarah_AlTujjar.jpg', '2024-07-15 08:34:49.000000'),
(42, 'Mohammad Bilal Anwar', 'Web Developer', 'CD-4332', 'black', 'Bilal_Anwar.jpg', '2024-07-15 08:34:49.000000'),
(43, 'Anthony Najem', 'Sales Representer', 'CD-3333', 'white', 'Anthony_Najem.jpg', '2024-07-15 08:34:49.000000'),
(44, 'Unknow', 'unknown', 'unknown', 'unknown', 'unknown.jpg', '2024-07-15 11:18:29.000000'),
(45, 'Dr Elie', 'Chief Executive Officer', 'CD-4332', 'white', 'Dr_Elie.jpg', '2024-07-15 11:18:29.000000'),
(46, 'Sarah AlTujjar', 'Software Developer', 'CD-4332', 'black', 'Sarah_AlTujjar.jpg', '2024-07-15 08:34:49.000000'),
(47, 'Mohammad Bilal Anwar', 'Web Developer', 'CD-4332', 'black', 'Bilal_Anwar.jpg', '2024-07-15 08:34:49.000000'),
(48, 'Anthony Najem', 'Sales Representer', 'CD-3333', 'white', 'Anthony_Najem.jpg', '2024-07-15 08:34:49.000000'),
(49, 'Unknow', 'unknown', 'unknown', 'unknown', 'unknown.jpg', '2024-07-15 11:18:29.000000');

-- --------------------------------------------------------

--
-- Table structure for table `moiapp_wrongparking`
--

CREATE TABLE `moiapp_wrongparking` (
  `id` bigint(20) NOT NULL,
  `emp_id` bigint(20) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `car_model` varchar(100) NOT NULL,
  `color` varchar(50) NOT NULL,
  `plate_text` varchar(20) NOT NULL,
  `image` varchar(500) NOT NULL,
  `time` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `moiapp_wrongparking`
--

INSERT INTO `moiapp_wrongparking` (`id`, `emp_id`, `status`, `car_model`, `color`, `plate_text`, `image`, `time`) VALUES
(1, 4, 1, 'honda', 'red', 'CFD-5478', 'car_default.png', '2024-07-21 12:46:06.000000'),
(2, 2, 0, 'civic', 'green', 'XSE-5784', 'car_default.png', '2024-07-23 13:57:12.000000'),
(5, 3, 0, 'chery', 'blue', 'CFD-5479', 'car_default.png', '2024-07-21 14:47:06.000000'),
(6, 4, 0, 'gmc', 'ornge', 'XSE-7584', 'car_default.png', '2024-07-24 10:30:54.000000'),
(7, 3, 0, 'gmc', 'red', 'XSE-7584', 'car_default.png', '2024-07-24 10:30:50.000000'),
(8, 2, 1, 'hundai', 'pink', 'XSE-7999', 'car_default.png', '2024-07-24 16:46:06.000000'),
(9, 1, 1, 'sadasda', 'black', 'XSE-7222', 'car_default.png', '2024-07-24 19:46:06.000000'),
(10, 4, 1, 'honda', 'red', 'CFD-5478', 'car_default.png', '2024-07-21 12:46:06.000000'),
(11, 2, 0, 'civic', 'green', 'XSE-5784', 'car_default.png', '2024-07-23 13:57:12.000000'),
(12, 3, 0, 'chery', 'blue', 'CFD-5479', 'car_default.png', '2024-07-21 14:47:06.000000'),
(13, 4, 0, 'gmc', 'ornge', 'XSE-7584', 'car_default.png', '2024-07-24 10:30:54.000000'),
(14, 3, 0, 'gmc', 'red', 'XSE-7584', 'car_default.png', '2024-07-24 10:30:50.000000'),
(15, 2, 0, 'hundai', 'pink', 'XSE-7999', 'car_default.png', '2024-07-24 16:46:06.000000'),
(16, 1, 1, 'sadasda', 'black', 'XSE-7222', 'car_default.png', '2024-07-24 19:46:06.000000'),
(17, 4, 1, 'honda', 'red', 'CFD-5478', 'car_default.png', '2024-07-21 12:46:06.000000'),
(18, 2, 0, 'civic', 'green', 'XSE-5784', 'car_default.png', '2024-07-23 13:57:12.000000'),
(19, 3, 0, 'chery', 'blue', 'CFD-5479', 'car_default.png', '2024-07-21 14:47:06.000000'),
(20, 4, 0, 'gmc', 'ornge', 'XSE-7584', 'car_default.png', '2024-07-24 10:30:54.000000'),
(21, 3, 0, 'gmc', 'red', 'XSE-7584', 'car_default.png', '2024-07-24 10:30:50.000000'),
(22, 2, 0, 'hundai', 'pink', 'XSE-7999', 'car_default.png', '2024-07-24 16:46:06.000000'),
(23, 1, 1, 'sadasda', 'black', 'XSE-7222', 'car_default.png', '2024-07-24 19:46:06.000000'),
(24, 4, 1, 'honda', 'red', 'CFD-5478', 'car_default.png', '2024-07-21 12:46:06.000000'),
(25, 2, 0, 'civic', 'green', 'XSE-5784', 'car_default.png', '2024-07-23 13:57:12.000000'),
(26, 3, 0, 'chery', 'blue', 'CFD-5479', 'car_default.png', '2024-07-21 14:47:06.000000'),
(27, 4, 0, 'gmc', 'ornge', 'XSE-7584', 'car_default.png', '2024-07-24 10:30:54.000000'),
(28, 3, 0, 'gmc', 'red', 'XSE-7584', 'car_default.png', '2024-07-24 10:30:50.000000'),
(29, 2, 0, 'hundai', 'pink', 'XSE-7999', 'car_default.png', '2024-07-24 16:46:06.000000'),
(30, 1, 1, 'sadasda', 'black', 'XSE-7222', 'car_default.png', '2024-07-24 19:46:06.000000');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(3, 'Admin', 'admin@gmail.com', NULL, 'pbkdf2_sha256$600000$5ZtCyIrkLn7aourxWJ76ew$FSgynbKhGK076s7ggvC0ef1hIEIAm5hOrSnF70GPb8Y=', NULL, NULL, NULL),
(4, 'meer', 'meer@gmail.com', NULL, 'pbkdf2_sha256$600000$LgR0PliregJHVXg5QPSjw9$gqvESNW22yHvsJc08I9PkjAhRNe/PqAWisiU5lznri0=', NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`);

--
-- Indexes for table `auth_user`
--
ALTER TABLE `auth_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  ADD KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`);

--
-- Indexes for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  ADD KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  ADD KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`);

--
-- Indexes for table `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Indexes for table `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_expire_date_a5c62663` (`expire_date`);

--
-- Indexes for table `moiapp_carplate`
--
ALTER TABLE `moiapp_carplate`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `moiapp_detectionlog`
--
ALTER TABLE `moiapp_detectionlog`
  ADD PRIMARY KEY (`id`),
  ADD KEY `emp_id` (`emp_id`);

--
-- Indexes for table `moiapp_drone`
--
ALTER TABLE `moiapp_drone`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `moiapp_employee`
--
ALTER TABLE `moiapp_employee`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `moiapp_wrongparking`
--
ALTER TABLE `moiapp_wrongparking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `emp_id` (`emp_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `auth_user`
--
ALTER TABLE `auth_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `moiapp_carplate`
--
ALTER TABLE `moiapp_carplate`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `moiapp_detectionlog`
--
ALTER TABLE `moiapp_detectionlog`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT for table `moiapp_drone`
--
ALTER TABLE `moiapp_drone`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `moiapp_employee`
--
ALTER TABLE `moiapp_employee`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `moiapp_wrongparking`
--
ALTER TABLE `moiapp_wrongparking`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Constraints for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Constraints for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  ADD CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `moiapp_detectionlog`
--
ALTER TABLE `moiapp_detectionlog`
  ADD CONSTRAINT `moiapp_detectionlog_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `moiapp_employee` (`id`);

--
-- Constraints for table `moiapp_wrongparking`
--
ALTER TABLE `moiapp_wrongparking`
  ADD CONSTRAINT `moiapp_wrongparking_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `moiapp_employee` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
