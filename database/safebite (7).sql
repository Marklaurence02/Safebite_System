-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 20, 2025 at 07:28 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `safebite`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `log_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`log_id`, `user_id`, `action`, `timestamp`) VALUES
(1, 11, 'User logged in successfully', '2025-07-28 08:09:22'),
(2, 11, 'User logged in successfully', '2025-07-28 08:16:34'),
(3, 11, 'User logged in successfully', '2025-07-28 08:17:49'),
(4, 22, 'User logged in successfully', '2025-07-28 08:18:51'),
(5, 11, 'User logged in successfully', '2025-07-28 08:24:31'),
(6, 11, 'User logged in successfully', '2025-07-28 08:29:08'),
(7, 11, 'User logged in successfully', '2025-07-28 08:29:38'),
(8, 11, 'User logged in successfully', '2025-07-28 08:31:33'),
(9, 26, 'User logged in successfully', '2025-07-28 08:43:12'),
(10, 26, 'User logged in successfully', '2025-07-28 08:44:27'),
(11, 26, 'User logged in successfully', '2025-07-28 08:44:51'),
(12, 26, 'User logged in successfully', '2025-07-28 08:48:21'),
(13, 11, 'User logged in successfully', '2025-08-07 02:07:51'),
(14, 11, 'User logged in successfully', '2025-08-07 02:19:40'),
(15, 11, 'User logged in successfully', '2025-08-07 02:22:20'),
(16, 11, 'User logged in successfully', '2025-08-07 02:47:43'),
(17, 11, 'User logged in successfully', '2025-08-07 03:00:06'),
(18, 11, 'User logged in successfully', '2025-08-07 03:13:00'),
(19, 11, 'User logged in successfully', '2025-08-07 03:22:31'),
(20, 11, 'User logged in successfully', '2025-08-10 02:19:37'),
(21, 11, 'User logged in successfully', '2025-08-10 02:35:24'),
(22, 11, 'User logged in successfully', '2025-08-10 02:43:48'),
(23, 11, 'User logged in successfully', '2025-08-10 02:46:59'),
(24, 11, 'User logged in successfully', '2025-08-10 02:47:26'),
(25, 11, 'User logged in successfully', '2025-08-10 02:52:12'),
(26, 11, 'User logged in successfully', '2025-08-10 03:13:09'),
(27, 11, 'User logged in successfully', '2025-08-12 03:05:45'),
(28, 11, 'User logged in successfully', '2025-08-12 03:08:17'),
(29, 11, 'User logged in successfully', '2025-08-12 03:19:18'),
(30, 11, 'User logged in successfully', '2025-07-12 21:28:12'),
(31, 11, 'Added new food item: Strawberries', '2025-07-12 23:28:12'),
(32, 11, 'Updated sensor settings', '2025-07-13 01:28:12'),
(33, 11, 'Deleted expired food item: Ground Beef', '2025-07-13 03:28:12'),
(34, 11, 'Changed password', '2025-07-13 05:28:12'),
(35, 11, 'Updated profile information', '2025-07-13 07:28:12'),
(36, 11, 'Added new food item: Cream Cheese', '2025-07-13 09:28:12'),
(37, 11, 'User logged out', '2025-07-13 11:28:12'),
(38, 11, 'User logged in successfully', '2025-07-13 13:28:12'),
(39, 11, 'Updated food item: Strawberries', '2025-07-13 15:28:12'),
(40, 11, 'Added new sensor: Temperature', '2025-07-13 17:28:12'),
(41, 11, 'Deleted old sensor readings', '2025-07-13 19:28:12'),
(42, 11, 'User logged out', '2025-07-13 21:28:12'),
(43, 11, 'User logged in successfully', '2025-07-13 23:28:12'),
(44, 11, 'Added new food item: Milk', '2025-07-14 01:28:12'),
(45, 11, 'Updated expiration date for Cream Cheese', '2025-07-14 03:28:12'),
(46, 11, 'Changed email address', '2025-07-14 05:28:12'),
(47, 11, 'Added new sensor: Humidity', '2025-07-14 07:28:12'),
(48, 11, 'Deleted expired food item: Milk', '2025-07-14 09:28:12'),
(49, 11, 'User logged out', '2025-07-14 11:28:12'),
(50, 11, 'User logged in successfully', '2025-07-14 13:28:12'),
(51, 11, 'Added new food item: Chicken', '2025-07-14 15:28:12'),
(52, 11, 'Updated sensor calibration', '2025-07-14 17:28:12'),
(53, 11, 'Changed notification settings', '2025-07-14 19:28:12'),
(54, 11, 'Added new sensor: Gas', '2025-07-14 21:28:12'),
(55, 11, 'User logged out', '2025-07-14 23:28:12'),
(56, 22, 'User logged in successfully', '2025-07-15 01:28:12'),
(57, 22, 'Added new food item: Canned Beans', '2025-07-15 03:28:12'),
(58, 22, 'Updated profile picture', '2025-07-15 05:28:12'),
(59, 22, 'Changed password', '2025-07-15 07:28:12'),
(60, 22, 'Added new sensor: Temperature', '2025-07-15 09:28:12'),
(61, 22, 'Deleted old sensor data', '2025-07-15 11:28:12'),
(62, 22, 'User logged out', '2025-07-15 13:28:12'),
(63, 22, 'User logged in successfully', '2025-07-15 15:28:12'),
(64, 22, 'Updated food item: Canned Beans', '2025-07-15 17:28:12'),
(65, 22, 'Added new sensor: Humidity', '2025-07-15 19:28:12'),
(66, 22, 'Changed email address', '2025-07-15 21:28:12'),
(67, 22, 'User logged out', '2025-07-15 23:28:12'),
(68, 22, 'User logged in successfully', '2025-07-16 01:28:12'),
(69, 22, 'Added new food item: Yogurt', '2025-07-16 03:28:12'),
(70, 22, 'Updated sensor settings', '2025-07-16 05:28:12'),
(71, 22, 'Deleted expired food item: Yogurt', '2025-07-16 07:28:12'),
(72, 22, 'User logged out', '2025-07-16 09:28:12'),
(73, 23, 'User logged in successfully', '2025-07-16 11:28:12'),
(74, 23, 'Added new food item: Bread', '2025-07-16 13:28:12'),
(75, 23, 'Updated profile information', '2025-07-16 15:28:12'),
(76, 23, 'Changed password', '2025-07-16 17:28:12'),
(77, 23, 'User logged out', '2025-07-16 19:28:12'),
(78, 23, 'User logged in successfully', '2025-07-16 21:28:12'),
(79, 23, 'Deleted food item: Bread', '2025-07-16 23:28:12'),
(80, 23, 'Added new sensor: Temperature', '2025-07-17 01:28:12'),
(81, 23, 'User logged out', '2025-07-17 03:28:12'),
(82, 11, 'User logged in successfully', '2025-07-12 21:28:18'),
(83, 11, 'Added new food item: Strawberries', '2025-07-12 23:28:18'),
(84, 11, 'Updated sensor settings', '2025-07-13 01:28:18'),
(85, 11, 'Deleted expired food item: Ground Beef', '2025-07-13 03:28:18'),
(86, 11, 'Changed password', '2025-07-13 05:28:18'),
(87, 11, 'Updated profile information', '2025-07-13 07:28:18'),
(88, 11, 'Added new food item: Cream Cheese', '2025-07-13 09:28:18'),
(89, 11, 'User logged out', '2025-07-13 11:28:18'),
(90, 11, 'User logged in successfully', '2025-07-13 13:28:18'),
(91, 11, 'Updated food item: Strawberries', '2025-07-13 15:28:18'),
(92, 11, 'Added new sensor: Temperature', '2025-07-13 17:28:18'),
(93, 11, 'Deleted old sensor readings', '2025-07-13 19:28:18'),
(94, 11, 'User logged out', '2025-07-13 21:28:18'),
(95, 11, 'User logged in successfully', '2025-07-13 23:28:18'),
(96, 11, 'Added new food item: Milk', '2025-07-14 01:28:18'),
(97, 11, 'Updated expiration date for Cream Cheese', '2025-07-14 03:28:18'),
(98, 11, 'Changed email address', '2025-07-14 05:28:18'),
(99, 11, 'Added new sensor: Humidity', '2025-07-14 07:28:18'),
(100, 11, 'Deleted expired food item: Milk', '2025-07-14 09:28:18'),
(101, 11, 'User logged out', '2025-07-14 11:28:18'),
(102, 11, 'User logged in successfully', '2025-07-14 13:28:18'),
(103, 11, 'Added new food item: Chicken', '2025-07-14 15:28:18'),
(104, 11, 'Updated sensor calibration', '2025-07-14 17:28:18'),
(105, 11, 'Changed notification settings', '2025-07-14 19:28:18'),
(106, 11, 'Added new sensor: Gas', '2025-07-14 21:28:18'),
(107, 11, 'User logged out', '2025-07-14 23:28:18'),
(108, 22, 'User logged in successfully', '2025-07-15 01:28:18'),
(109, 22, 'Added new food item: Canned Beans', '2025-07-15 03:28:18'),
(110, 22, 'Updated profile picture', '2025-07-15 05:28:18'),
(111, 22, 'Changed password', '2025-07-15 07:28:18'),
(112, 22, 'Added new sensor: Temperature', '2025-07-15 09:28:18'),
(113, 22, 'Deleted old sensor data', '2025-07-15 11:28:18'),
(114, 22, 'User logged out', '2025-07-15 13:28:18'),
(115, 22, 'User logged in successfully', '2025-07-15 15:28:18'),
(116, 22, 'Updated food item: Canned Beans', '2025-07-15 17:28:18'),
(117, 22, 'Added new sensor: Humidity', '2025-07-15 19:28:18'),
(118, 22, 'Changed email address', '2025-07-15 21:28:18'),
(119, 22, 'User logged out', '2025-07-15 23:28:18'),
(120, 22, 'User logged in successfully', '2025-07-16 01:28:18'),
(121, 22, 'Added new food item: Yogurt', '2025-07-16 03:28:18'),
(122, 22, 'Updated sensor settings', '2025-07-16 05:28:18'),
(123, 22, 'Deleted expired food item: Yogurt', '2025-07-16 07:28:18'),
(124, 22, 'User logged out', '2025-07-16 09:28:18'),
(125, 23, 'User logged in successfully', '2025-07-16 11:28:18'),
(126, 23, 'Added new food item: Bread', '2025-07-16 13:28:18'),
(127, 23, 'Updated profile information', '2025-07-16 15:28:18'),
(128, 23, 'Changed password', '2025-07-16 17:28:18'),
(129, 23, 'User logged out', '2025-07-16 19:28:18'),
(130, 23, 'User logged in successfully', '2025-07-16 21:28:18'),
(131, 23, 'Deleted food item: Bread', '2025-07-16 23:28:18'),
(132, 23, 'Added new sensor: Temperature', '2025-07-17 01:28:18'),
(133, 23, 'User logged out', '2025-07-17 03:28:18'),
(134, 11, 'User logged in successfully', '2025-07-12 21:29:16'),
(135, 11, 'Added new food item: Strawberries', '2025-07-12 23:29:16'),
(136, 11, 'Updated sensor settings', '2025-07-13 01:29:16'),
(137, 11, 'Deleted expired food item: Ground Beef', '2025-07-13 03:29:16'),
(138, 11, 'Changed password', '2025-07-13 05:29:16'),
(139, 11, 'Updated profile information', '2025-07-13 07:29:16'),
(140, 11, 'Added new food item: Cream Cheese', '2025-07-13 09:29:16'),
(141, 11, 'User logged out', '2025-07-13 11:29:16'),
(142, 11, 'User logged in successfully', '2025-07-13 13:29:16'),
(143, 11, 'Updated food item: Strawberries', '2025-07-13 15:29:16'),
(144, 11, 'Added new sensor: Temperature', '2025-07-13 17:29:16'),
(145, 11, 'Deleted old sensor readings', '2025-07-13 19:29:16'),
(146, 11, 'User logged out', '2025-07-13 21:29:16'),
(147, 11, 'User logged in successfully', '2025-07-13 23:29:16'),
(148, 11, 'Added new food item: Milk', '2025-07-14 01:29:16'),
(149, 11, 'Updated expiration date for Cream Cheese', '2025-07-14 03:29:16'),
(150, 11, 'Changed email address', '2025-07-14 05:29:16'),
(151, 11, 'Added new sensor: Humidity', '2025-07-14 07:29:16'),
(152, 11, 'Deleted expired food item: Milk', '2025-07-14 09:29:16'),
(153, 11, 'User logged out', '2025-07-14 11:29:16'),
(154, 11, 'User logged in successfully', '2025-07-14 13:29:16'),
(155, 11, 'Added new food item: Chicken', '2025-07-14 15:29:16'),
(156, 11, 'Updated sensor calibration', '2025-07-14 17:29:16'),
(157, 11, 'Changed notification settings', '2025-07-14 19:29:16'),
(158, 11, 'Added new sensor: Gas', '2025-07-14 21:29:16'),
(159, 11, 'User logged out', '2025-07-14 23:29:16'),
(160, 22, 'User logged in successfully', '2025-07-15 01:29:16'),
(161, 22, 'Added new food item: Canned Beans', '2025-07-15 03:29:16'),
(162, 22, 'Updated profile picture', '2025-07-15 05:29:16'),
(163, 22, 'Changed password', '2025-07-15 07:29:16'),
(164, 22, 'Added new sensor: Temperature', '2025-07-15 09:29:16'),
(165, 22, 'Deleted old sensor data', '2025-07-15 11:29:16'),
(166, 22, 'User logged out', '2025-07-15 13:29:16'),
(167, 22, 'User logged in successfully', '2025-07-15 15:29:16'),
(168, 22, 'Updated food item: Canned Beans', '2025-07-15 17:29:16'),
(169, 22, 'Added new sensor: Humidity', '2025-07-15 19:29:16'),
(170, 22, 'Changed email address', '2025-07-15 21:29:16'),
(171, 22, 'User logged out', '2025-07-15 23:29:16'),
(172, 22, 'User logged in successfully', '2025-07-16 01:29:16'),
(173, 22, 'Added new food item: Yogurt', '2025-07-16 03:29:16'),
(174, 22, 'Updated sensor settings', '2025-07-16 05:29:16'),
(175, 22, 'Deleted expired food item: Yogurt', '2025-07-16 07:29:16'),
(176, 22, 'User logged out', '2025-07-16 09:29:16'),
(177, 23, 'User logged in successfully', '2025-07-16 11:29:16'),
(178, 23, 'Added new food item: Bread', '2025-07-16 13:29:16'),
(179, 23, 'Updated profile information', '2025-07-16 15:29:16'),
(180, 23, 'Changed password', '2025-07-16 17:29:16'),
(181, 23, 'User logged out', '2025-07-16 19:29:16'),
(182, 23, 'User logged in successfully', '2025-07-16 21:29:16'),
(183, 23, 'Deleted food item: Bread', '2025-07-16 23:29:16'),
(184, 23, 'Added new sensor: Temperature', '2025-07-17 01:29:16'),
(185, 23, 'User logged out', '2025-07-17 03:29:16'),
(186, 11, 'User logged in successfully', '2025-07-12 21:29:22'),
(187, 11, 'Added new food item: Strawberries', '2025-07-12 23:29:22'),
(188, 11, 'Updated sensor settings', '2025-07-13 01:29:22'),
(189, 11, 'Deleted expired food item: Ground Beef', '2025-07-13 03:29:22'),
(190, 11, 'Changed password', '2025-07-13 05:29:22'),
(191, 11, 'Updated profile information', '2025-07-13 07:29:22'),
(192, 11, 'Added new food item: Cream Cheese', '2025-07-13 09:29:22'),
(193, 11, 'User logged out', '2025-07-13 11:29:22'),
(194, 11, 'User logged in successfully', '2025-07-13 13:29:22'),
(195, 11, 'Updated food item: Strawberries', '2025-07-13 15:29:22'),
(196, 11, 'Added new sensor: Temperature', '2025-07-13 17:29:22'),
(197, 11, 'Deleted old sensor readings', '2025-07-13 19:29:22'),
(198, 11, 'User logged out', '2025-07-13 21:29:22'),
(199, 11, 'User logged in successfully', '2025-07-13 23:29:22'),
(200, 11, 'Added new food item: Milk', '2025-07-14 01:29:22'),
(201, 11, 'Updated expiration date for Cream Cheese', '2025-07-14 03:29:22'),
(202, 11, 'Changed email address', '2025-07-14 05:29:22'),
(203, 11, 'Added new sensor: Humidity', '2025-07-14 07:29:22'),
(204, 11, 'Deleted expired food item: Milk', '2025-07-14 09:29:22'),
(205, 11, 'User logged out', '2025-07-14 11:29:22'),
(206, 11, 'User logged in successfully', '2025-07-14 13:29:22'),
(207, 11, 'Added new food item: Chicken', '2025-07-14 15:29:22'),
(208, 11, 'Updated sensor calibration', '2025-07-14 17:29:22'),
(209, 11, 'Changed notification settings', '2025-07-14 19:29:22'),
(210, 11, 'Added new sensor: Gas', '2025-07-14 21:29:22'),
(211, 11, 'User logged out', '2025-07-14 23:29:22'),
(212, 22, 'User logged in successfully', '2025-07-15 01:29:22'),
(213, 22, 'Added new food item: Canned Beans', '2025-07-15 03:29:22'),
(214, 22, 'Updated profile picture', '2025-07-15 05:29:22'),
(215, 22, 'Changed password', '2025-07-15 07:29:22'),
(216, 22, 'Added new sensor: Temperature', '2025-07-15 09:29:22'),
(217, 22, 'Deleted old sensor data', '2025-07-15 11:29:22'),
(218, 22, 'User logged out', '2025-07-15 13:29:22'),
(219, 22, 'User logged in successfully', '2025-07-15 15:29:22'),
(220, 22, 'Updated food item: Canned Beans', '2025-07-15 17:29:22'),
(221, 22, 'Added new sensor: Humidity', '2025-07-15 19:29:22'),
(222, 22, 'Changed email address', '2025-07-15 21:29:22'),
(223, 22, 'User logged out', '2025-07-15 23:29:22'),
(224, 22, 'User logged in successfully', '2025-07-16 01:29:22'),
(225, 22, 'Added new food item: Yogurt', '2025-07-16 03:29:22'),
(226, 22, 'Updated sensor settings', '2025-07-16 05:29:22'),
(227, 22, 'Deleted expired food item: Yogurt', '2025-07-16 07:29:22'),
(228, 22, 'User logged out', '2025-07-16 09:29:22'),
(229, 23, 'User logged in successfully', '2025-07-16 11:29:22'),
(230, 23, 'Added new food item: Bread', '2025-07-16 13:29:22'),
(231, 23, 'Updated profile information', '2025-07-16 15:29:22'),
(232, 23, 'Changed password', '2025-07-16 17:29:22'),
(233, 23, 'User logged out', '2025-07-16 19:29:22'),
(234, 23, 'User logged in successfully', '2025-07-16 21:29:22'),
(235, 23, 'Deleted food item: Bread', '2025-07-16 23:29:22'),
(236, 23, 'Added new sensor: Temperature', '2025-07-17 01:29:22'),
(237, 23, 'User logged out', '2025-07-17 03:29:22'),
(238, 11, 'User logged in successfully', '2025-08-12 07:22:11'),
(239, 11, 'User logged in successfully', '2025-08-12 07:23:03'),
(240, 11, 'User logged in successfully', '2025-08-12 07:29:43'),
(241, 11, 'User logged in successfully', '2025-08-12 07:33:00'),
(242, 11, 'User logged in successfully', '2025-08-12 07:38:43'),
(243, 11, 'User logged out', '2025-08-12 07:38:52'),
(244, 11, 'User logged in successfully', '2025-08-12 07:38:55'),
(245, 11, 'User logged out', '2025-08-12 08:27:21'),
(246, 11, 'User logged in successfully', '2025-08-12 08:38:37'),
(247, 11, 'User logged out', '2025-08-12 13:10:16'),
(248, 26, 'User logged in successfully', '2025-08-17 00:43:21'),
(249, 26, 'User logged out', '2025-08-17 00:51:47'),
(250, 11, 'User logged in successfully', '2025-08-17 00:52:01'),
(251, 11, 'User logged out', '2025-08-17 00:53:00'),
(252, 11, 'User logged in successfully', '2025-08-17 00:53:04'),
(253, 11, 'User logged out', '2025-08-17 01:08:00'),
(254, 26, 'User logged in successfully', '2025-08-17 01:08:08'),
(255, 26, 'User logged in successfully', '2025-08-18 05:21:03'),
(256, 26, 'User logged in successfully', '2025-08-19 03:55:41'),
(257, 26, 'User logged out', '2025-08-19 04:12:48'),
(258, 26, 'User logged in successfully', '2025-08-19 04:12:51'),
(259, 26, 'User logged in successfully', '2025-08-19 04:31:42'),
(260, 26, 'User logged out', '2025-08-19 04:36:09'),
(261, 26, 'User logged in successfully', '2025-08-19 04:36:13'),
(262, 11, 'User logged in successfully', '2025-08-19 04:50:15'),
(263, 11, 'User logged out', '2025-08-19 04:50:59'),
(264, 11, 'User logged in successfully', '2025-08-19 04:54:06'),
(265, 11, 'User logged out', '2025-08-19 04:54:13'),
(266, 26, 'User logged in successfully', '2025-08-19 04:54:18'),
(267, 26, 'User logged in successfully', '2025-08-20 04:26:23'),
(268, 26, 'User logged out', '2025-08-20 04:44:05'),
(269, 26, 'User logged in successfully', '2025-08-20 04:44:08'),
(270, 26, 'User logged out', '2025-08-20 04:46:53'),
(271, 26, 'User logged in successfully', '2025-08-20 04:47:00'),
(272, 26, 'User logged out', '2025-08-20 04:59:07'),
(273, 26, 'User logged in successfully', '2025-08-20 04:59:10'),
(274, 26, 'User logged out', '2025-08-20 05:03:37'),
(275, 26, 'User logged in successfully', '2025-08-20 05:03:40');

-- --------------------------------------------------------

--
-- Table structure for table `alerts`
--

CREATE TABLE `alerts` (
  `alert_id` int(11) NOT NULL,
  `sensor_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `alert_level` enum('Low','Medium','High') DEFAULT 'Low',
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alerts`
--

INSERT INTO `alerts` (`alert_id`, `sensor_id`, `user_id`, `message`, `alert_level`, `timestamp`) VALUES
(8, 13, 11, 'Temperature too high for strawberries', 'Low', '2025-07-03 15:39:24'),
(9, 14, 11, 'Humidity level unsuitable for ground beef', 'Low', '2025-07-03 15:39:24'),
(10, 15, 11, 'Methane levels abnormal near cream cheese', 'Low', '2025-07-03 15:39:24'),
(201, 101, 22, 'Temperature near milk is above safe level', 'Medium', '2025-07-24 06:32:41'),
(202, 102, 22, 'Humidity for chicken is slightly high', 'Low', '2025-07-24 06:32:41'),
(203, 103, 22, 'Gas concentration detected near canned beans', 'Low', '2025-07-24 06:32:41');

-- --------------------------------------------------------

--
-- Table structure for table `food_items`
--

CREATE TABLE `food_items` (
  `food_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `expiration_date` date DEFAULT NULL,
  `sensor_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `food_items`
--

INSERT INTO `food_items` (`food_id`, `name`, `category`, `expiration_date`, `sensor_id`, `created_at`, `updated_at`) VALUES
(9, 'Strawberries', 'Fruit', '2025-07-09', 13, '2025-07-03 15:39:24', '2025-07-03 15:39:24'),
(10, 'Ground Beef', 'Meat', '2025-07-04', 14, '2025-07-03 15:39:24', '2025-07-03 15:39:24'),
(11, 'Cream Cheese', 'Dairy', '2025-07-06', 15, '2025-07-03 15:39:24', '2025-07-03 15:39:24'),
(201, 'Milk', 'Dairy', '2025-07-30', 101, '2025-07-24 06:32:41', '2025-07-24 06:32:41'),
(202, 'Chicken', 'Meat', '2025-07-27', 102, '2025-07-24 06:32:41', '2025-07-24 06:32:41'),
(203, 'Canned Beans', 'Canned', '2026-01-15', 103, '2025-07-24 06:32:41', '2025-07-24 06:32:41');

-- --------------------------------------------------------

--
-- Table structure for table `readings`
--

CREATE TABLE `readings` (
  `reading_id` int(11) NOT NULL,
  `sensor_id` int(11) DEFAULT NULL,
  `value` float NOT NULL,
  `unit` varchar(20) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `readings`
--

INSERT INTO `readings` (`reading_id`, `sensor_id`, `value`, `unit`, `timestamp`) VALUES
(11, 13, 35.2, '°C', '2025-07-03 15:39:24'),
(12, 14, 80, '%', '2025-07-03 15:39:24'),
(13, 15, 0.07, 'ppm', '2025-07-02 15:39:24'),
(301, 101, 4.5, '°C', '2025-07-24 06:32:41'),
(302, 102, 65, '%', '2025-07-24 06:32:41'),
(303, 103, 0.03, 'ppm', '2025-07-24 06:32:41');

-- --------------------------------------------------------

--
-- Table structure for table `sensor`
--

CREATE TABLE `sensor` (
  `sensor_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sensor`
--

INSERT INTO `sensor` (`sensor_id`, `type`, `user_id`, `is_active`, `created_at`, `updated_at`) VALUES
(13, 'Temperature', 11, 1, '2025-07-03 15:39:24', '2025-07-03 15:39:24'),
(14, 'Humidity', 11, 1, '2025-07-03 15:39:24', '2025-07-03 15:39:24'),
(15, 'Gas', 11, 1, '2025-07-03 15:39:24', '2025-07-03 15:39:24'),
(101, 'Temperature', 22, 1, '2025-07-24 06:32:41', '2025-07-24 06:32:41'),
(102, 'Humidity', 22, 1, '2025-07-24 06:32:41', '2025-07-24 06:32:41'),
(103, 'Gas', 22, 1, '2025-07-24 06:32:41', '2025-07-24 06:32:41');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `session_token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `user_id`, `session_token`, `expires_at`, `created_at`) VALUES
(193, 11, '275117b8a4e4a9748bb4541d5965aae60ef79f2336fbb877dee61eca03928330', '2025-08-13 20:07:51', '2025-08-07 02:07:51'),
(194, 11, '1c30c20a439556909196105407c8d2267eb6c9714cec835cd07f11b6dd56cff9', '2025-08-13 20:19:40', '2025-08-07 02:19:40'),
(195, 11, '5e4e8f818b9ae4513863ce6e12577f1427cabd0b11189acca7d5ad81ee072bcd', '2025-08-13 20:22:20', '2025-08-07 02:22:20'),
(196, 11, '5fc3fe3dbc78880d6c0ab63f89113f86a6564b8ab1c19fbfcd4911dd2b7323f0', '2025-08-13 20:47:43', '2025-08-07 02:47:43'),
(197, 11, 'c1af789b0aac68e078cfa760c560e6b14f38f1de9a4278215edc3dd3f3d6a9e0', '2025-08-13 21:00:06', '2025-08-07 03:00:06'),
(198, 11, 'ea0eb09be133189c600b463b1e01cd6487556d9aa5fca4befef3da3623abaabe', '2025-08-13 21:13:00', '2025-08-07 03:13:00'),
(199, 11, 'dfdd9167eb761ee5928e7033856e43fa16b9a091dd373ca8adb88711acbd28b7', '2025-08-13 21:22:31', '2025-08-07 03:22:31'),
(200, 11, 'ec323133b4dd0c4d6ddccce952fa09ac8e27685bef22297fa3ae2d8074404fde', '2025-08-16 20:19:37', '2025-08-10 02:19:37'),
(201, 11, '91d21990d5e0fdb03fa0c6515d67206688f5921b46f6ec827e34392a651a3b58', '2025-08-16 20:35:24', '2025-08-10 02:35:24'),
(202, 11, 'dae269252aa6775ec3c6879bf2efa97bccc2a8354ccde6e79fcde0aa8753f310', '2025-08-16 20:43:48', '2025-08-10 02:43:48'),
(203, 11, '702a58e0b63f197f2c75d44e97c9f05d7fdc959e8f7283900bbc50597db3a5ae', '2025-08-16 20:46:59', '2025-08-10 02:46:59'),
(204, 11, '19ac905354e992c45cf61fa50051caad4356ccf2848eff5450528f36f9b8d6d4', '2025-08-16 20:47:26', '2025-08-10 02:47:26'),
(205, 11, '10543bade92c6b13f96fbf66a8d36d8e87da672da1242512d59f20d0878d96b6', '2025-08-16 20:52:12', '2025-08-10 02:52:12'),
(206, 11, '76144786b3600086cff1ea854fd2b5e4002f2a2dee9421a6aa12d724e20c9c2f', '2025-08-16 21:13:09', '2025-08-10 03:13:09'),
(207, 11, '92d3fe17aefeeb7b1316a634d38c67edb830233860c1122fffa1d550dda41305', '2025-08-18 21:05:45', '2025-08-12 03:05:45'),
(208, 11, '9f50f75f6f1ca7c58d6890a509c11881da14816f45026f62864105d1041f309a', '2025-08-18 21:08:17', '2025-08-12 03:08:17'),
(209, 11, 'c360561298748f36bc3002f7602b2a17e5ce8a00c81fb54f613b42321bfca0df', '2025-08-18 21:19:18', '2025-08-12 03:19:18'),
(210, 11, '649b9377c5da8f79bedd3f28c60cf5649e742ba1f2c0a787f2fba043908fe59e', '2025-08-19 01:22:11', '2025-08-12 07:22:11'),
(211, 11, '2a10907d316585169d5f69de96f83d96134a81b45ca8e47f69caf23f1ed764d0', '2025-08-19 01:23:03', '2025-08-12 07:23:03'),
(212, 11, '3a287ed812dde95b9dbcc81a4ba791a16fc843b087782c505703b3d1baf032ef', '2025-08-19 01:29:43', '2025-08-12 07:29:43'),
(213, 11, 'aba8a71875943a4ec16e0925c96c46a52496ed609b121bbbec0c11fafa8378ad', '2025-08-19 01:33:00', '2025-08-12 07:33:00'),
(220, 26, '731f194349bebeaa3f92fa5dd8f9d10c0d7899f6e825cf1053fe3188ec20692a', '2025-08-23 19:08:08', '2025-08-17 01:08:08'),
(221, 26, '19366af46cfb6a9b3738430447d689f3580dc0b9902db9f5717a516d83bc301d', '2025-08-24 23:21:03', '2025-08-18 05:21:03'),
(223, 26, '17d7914cb8d8fa93de8662ae4051a6da4ea9c6707ed662f97a2611a1ec57eb64', '2025-08-25 22:12:51', '2025-08-19 04:12:51'),
(225, 26, 'fc210e1dc2171fee829a08785ad4f5c3852971fc43dff62e64fb8e2e21ed575f', '2025-08-25 22:36:13', '2025-08-19 04:36:13'),
(228, 26, '17798322931f1daa5761ad436012c968739c3cc12299b5b7511298411390b66a', '2025-08-25 22:54:18', '2025-08-19 04:54:18'),
(233, 26, '71cbd33e539b6424f2e02d85c34a7b9d58c0bb5981bf4ea400cd700cba5df1cc', '2025-08-26 23:03:40', '2025-08-20 05:03:40');

-- --------------------------------------------------------

--
-- Table structure for table `testertypes`
--

CREATE TABLE `testertypes` (
  `TesterTypeID` int(11) NOT NULL,
  `TesterTypeName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `testertypes`
--

INSERT INTO `testertypes` (`TesterTypeID`, `TesterTypeName`) VALUES
(1, 'Personal Tester'),
(2, 'Canteen Tester'),
(3, 'Restaurant Tester'),
(4, 'Cafeteria Tester'),
(5, 'Catering Tester');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `role` enum('User','Admin') DEFAULT 'User',
  `account_status` enum('active','inactive') DEFAULT 'active',
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `reset_otp` varchar(10) DEFAULT NULL,
  `otp_expiry` datetime DEFAULT NULL,
  `tester_type_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `username`, `email`, `contact_number`, `role`, `account_status`, `password_hash`, `created_at`, `updated_at`, `reset_otp`, `otp_expiry`, `tester_type_id`) VALUES
(11, 'Mark', 'Laurence', 'Mark', 'marktiktok525@gmail.com', '09999999999', 'User', 'active', '$2b$10$lr.Qtvu1ML2FyxojlXReC.PDu.f1cUcBBePOUSVwv05zKITn0uXP.', '2025-07-03 15:39:36', '2025-08-17 12:50:22', NULL, NULL, 1),
(22, 'mark', 'caringal', 'ybaha', 'marklaurencecaringal1@gmail.com', '09848705548', 'User', 'active', '$2b$10$E5UDZC47ReShfI3t.HqrteQSg2pVWUL3On1s6DxhNtR5EjllVQ1h6', '2025-07-14 02:32:59', '2025-08-17 12:50:22', NULL, NULL, 2),
(23, 'ee', 'User', 'ee', 'ee@gmail.com', NULL, 'User', 'active', '$2b$10$0nlymAoDDwtoP1c3Mb47ceX0kQkQ7cRzs9j562e6b70Tej9uHnHVS', '2025-07-14 01:21:46', '2025-08-17 12:50:22', NULL, NULL, 3),
(26, 'mark', 'User', 'Mark23', 'marklaurencecaringal7@gmail.com', NULL, 'Admin', 'active', '$2b$10$N93mwQPUZx1flvIayMh1ZuYEVZN.E09zfiS0E/J80hGqS1SvntJF2', '2025-07-09 05:56:06', '2025-08-17 12:50:22', NULL, NULL, 4),
(30, 'mark', 'baa', 'abna', 'hahah@gmail.com', '098558758668', 'User', 'active', '$2b$10$fXQKRY.ung923C23Rq7cL.DmAT94N01TF8p2NsFkdgs7a0ngPo3CS', '2025-07-20 12:37:39', '2025-08-17 12:50:22', NULL, NULL, 5),
(31, 'Mark', 'Laurence', 'Markll', 'benzoncarl010@gmail.com', '0998484484', 'User', 'active', '$2b$10$9pJqr6UQIVU7qhIhJBcKDONXwMAxsDpWgMlMrK8p9HmZ9CRudzGTS', '2025-07-28 05:07:03', '2025-08-17 12:50:22', NULL, NULL, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `alerts`
--
ALTER TABLE `alerts`
  ADD PRIMARY KEY (`alert_id`),
  ADD KEY `sensor_id` (`sensor_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `food_items`
--
ALTER TABLE `food_items`
  ADD PRIMARY KEY (`food_id`),
  ADD KEY `sensor_id` (`sensor_id`);

--
-- Indexes for table `readings`
--
ALTER TABLE `readings`
  ADD PRIMARY KEY (`reading_id`),
  ADD KEY `sensor_id` (`sensor_id`);

--
-- Indexes for table `sensor`
--
ALTER TABLE `sensor`
  ADD PRIMARY KEY (`sensor_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD UNIQUE KEY `session_token` (`session_token`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `testertypes`
--
ALTER TABLE `testertypes`
  ADD PRIMARY KEY (`TesterTypeID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=276;

--
-- AUTO_INCREMENT for table `alerts`
--
ALTER TABLE `alerts`
  MODIFY `alert_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=204;

--
-- AUTO_INCREMENT for table `food_items`
--
ALTER TABLE `food_items`
  MODIFY `food_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=204;

--
-- AUTO_INCREMENT for table `readings`
--
ALTER TABLE `readings`
  MODIFY `reading_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=304;

--
-- AUTO_INCREMENT for table `sensor`
--
ALTER TABLE `sensor`
  MODIFY `sensor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1007;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=234;

--
-- AUTO_INCREMENT for table `testertypes`
--
ALTER TABLE `testertypes`
  MODIFY `TesterTypeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `alerts`
--
ALTER TABLE `alerts`
  ADD CONSTRAINT `alerts_ibfk_1` FOREIGN KEY (`sensor_id`) REFERENCES `sensor` (`sensor_id`),
  ADD CONSTRAINT `alerts_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `food_items`
--
ALTER TABLE `food_items`
  ADD CONSTRAINT `food_items_ibfk_1` FOREIGN KEY (`sensor_id`) REFERENCES `sensor` (`sensor_id`);

--
-- Constraints for table `readings`
--
ALTER TABLE `readings`
  ADD CONSTRAINT `readings_ibfk_1` FOREIGN KEY (`sensor_id`) REFERENCES `sensor` (`sensor_id`);

--
-- Constraints for table `sensor`
--
ALTER TABLE `sensor`
  ADD CONSTRAINT `sensor_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
