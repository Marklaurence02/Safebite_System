here -- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 28, 2025 at 07:59 AM
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
(2, 11, 'f297658838cb93c1865c7e413ef13e025d768831f4a8125608ee0d343219c80f', '2025-07-10 15:42:05', '2025-07-03 15:42:05'),
(3, 11, 'e24644f2a8ee520125633689cb310b65a036239c3afb1bc06e6a5f7fb5109047', '2025-07-10 15:46:45', '2025-07-03 15:46:45'),
(4, 11, '04d8561bf8274ee5f2ede4a3b8a7b5b6de4665adbd52d1711e2abbbc1dc849bf', '2025-07-10 15:52:20', '2025-07-03 15:52:20'),
(5, 11, '4bfc72547e5247701a56010c9d251155e55eaa9db1e2533bee263c889fea90c0', '2025-07-10 15:55:34', '2025-07-03 15:55:34'),
(6, 11, 'c1ffded2a6fca884a47919c7020d2dc42183fa2a6148665ecedb234e70450545', '2025-07-10 15:58:28', '2025-07-03 15:58:28'),
(7, 11, 'd2aa27c8fd0da88f80462b484fc43bbe7f4cd3eaa01ea1730b79df8135378962', '2025-07-10 16:01:49', '2025-07-03 16:01:49'),
(8, 11, '9f412abb977bec19043a34b794536f7c89b3a87bfd437e5c09af3e7b7eacf284', '2025-07-10 16:05:09', '2025-07-03 16:05:09'),
(9, 11, 'ec3aa595cd8aa160c2882240dcc7ae347317d417b02e451877b6a2f61813d1f4', '2025-07-10 16:13:06', '2025-07-03 16:13:06'),
(10, 11, 'b24d2802652d0d5e04b2f63b5346f75c2280d021f7a4850cfcdf56471dfcba54', '2025-07-10 16:15:16', '2025-07-03 16:15:16'),
(11, 11, '0b02b5b615cffc2a3ce885663b882b2497d59c035127d96855119ec83797ceae', '2025-07-10 16:19:19', '2025-07-03 16:19:19'),
(12, 11, 'f0755fae52a19d47ba115b1dbc6aed634b92891c4a1f0e02f5c9c0a05ef7d5f7', '2025-07-10 16:30:41', '2025-07-03 16:30:41'),
(13, 11, 'b9abfc6dda34f430e981999218f62fb60ffd025df46a968e2e4a5ada1694406a', '2025-07-10 16:32:56', '2025-07-03 16:32:56'),
(14, 11, '3340de1c217375f776a411e2423aef975544c9ec21a1e202b11d100c35bfddd0', '2025-07-10 16:46:26', '2025-07-03 16:46:26'),
(15, 11, 'aa881231cd1c9b25c75f56d7fbef99a2da3a5d08a4b0c4064dc71989202fea05', '2025-07-10 16:48:27', '2025-07-03 16:48:27'),
(16, 11, 'dbaf0307746a241f872db5228c4b800cc207efdc60b3dd981f9cabb28e49881e', '2025-07-10 16:54:09', '2025-07-03 16:54:09'),
(17, 11, 'fb146c90e8d9b41ed5dfa69d922067d80d2516378989cc75517b154ce94e8650', '2025-07-10 16:58:45', '2025-07-03 16:58:45'),
(18, 11, 'd15d54ffdb86d0ada9197227100f5eaaed28e1ca22c8720c67c61ca226809d94', '2025-07-10 16:59:42', '2025-07-03 16:59:42'),
(19, 11, '08f018c15edbfd836d4978c2cdd9a7001434ed3aa04631c55ac90b5c816a9cd2', '2025-07-10 17:01:58', '2025-07-03 17:01:58'),
(20, 11, 'b55f375cba9ea964945f64eb967c74d9cf1a693d60009c57540b4d798380c6fa', '2025-07-10 17:08:02', '2025-07-03 17:08:02'),
(21, 11, '173246c95ebf9f8156543f0f58d4a60145e1bb6d189c14d6fa5b5afe931856ae', '2025-07-10 17:08:49', '2025-07-03 17:08:49'),
(22, 11, '5f86a1fd93759bf316fc9a805b0ca2ce591d92298dc7eb9a8b91c2e5929e1585', '2025-07-10 17:18:00', '2025-07-03 17:18:00'),
(23, 11, '3d579021633a25cc1d04526ab2f643c7edb53f5a4186aee53db9409202cd8c73', '2025-07-10 17:20:00', '2025-07-03 17:20:00'),
(24, 11, '617739d7d1a6ddc2858b95d0595efe22b7c31b9b1776f8c4218cc7d30a1936fe', '2025-07-10 17:21:35', '2025-07-03 17:21:35'),
(25, 11, 'b0543c8f52e0d3614fc097a52ae53791111400da7e5f6780176f24b798bc366d', '2025-07-10 17:24:17', '2025-07-03 17:24:17'),
(26, 11, '791ecff0996cb796bafd62812f7c554dc549ec0545e15f05142307f69f2596ac', '2025-07-10 17:27:44', '2025-07-03 17:27:44'),
(27, 11, '9acbf940e7c2274fce558cdd6beac86674b4b5c0843bf8bdd9e24a1f1c664f47', '2025-07-10 17:30:18', '2025-07-03 17:30:18'),
(28, 11, 'a1feb5972482e35015c639549d3f0d3de24479afa62fab5ada7b0ad14fa8f7d6', '2025-07-10 17:31:49', '2025-07-03 17:31:49'),
(29, 11, '073a761e033ac06884c1113ddc37462e15c0392ffe2552aa0f21eed6b25a1784', '2025-07-10 17:33:53', '2025-07-03 17:33:53'),
(30, 11, '21b48db239ffd48866f304173a4b257bdb156d667e9d8a55ab37bac699da9767', '2025-07-10 17:37:05', '2025-07-03 17:37:05'),
(31, 11, '46e635efca213066e8be668f6c922aa535e1599f9b1d2509b2021e24417fd64f', '2025-07-10 17:46:33', '2025-07-03 17:46:33'),
(32, 11, '25c3b8c61eaeac5a34ba479a94156368b358c9fafd6b9db5ecb17e9c2e8b3a8e', '2025-07-10 17:53:28', '2025-07-03 17:53:28'),
(33, 11, '006c8ad698f35df2f459a8e874c11d8d0c79eeaea6157148e754a1409821cb10', '2025-07-10 17:55:46', '2025-07-03 17:55:46'),
(34, 11, 'a019adf206ef94da4564a2e6d40670c069e439348ca1a473a1e279f50de080b8', '2025-07-10 17:59:14', '2025-07-03 17:59:14'),
(35, 11, '5cc85a9835f4458f86b850c48b43240b52b1d490e31bff13794f1938d9dddb0b', '2025-07-10 18:01:19', '2025-07-03 18:01:19'),
(36, 11, '341c833584a36ebb1879580a952f212f76de388ba3ee0ba9c7d504edf4de0a70', '2025-07-10 18:04:57', '2025-07-03 18:04:57'),
(37, 11, '0ce9a8442e05067ab246557911c7ae138cccbfc55ee8d214126f66cfd0cf4f2e', '2025-07-10 18:07:06', '2025-07-03 18:07:06'),
(38, 11, '73d72c1fe7f8ab8b1a2c70b8f5b5fdba73a5e4085a6c964ab4be414d00cc6f00', '2025-07-10 18:10:19', '2025-07-03 18:10:19'),
(39, 11, 'e4812d3dbac879aa942e054076f6ad7e622e18c79d84294fee3cd4d35cdfd28a', '2025-07-10 18:12:41', '2025-07-03 18:12:41'),
(40, 11, '456342a395ce41297faeb1b9be19c53d3b78f3bb17f0e3511146b78358596f82', '2025-07-10 18:13:46', '2025-07-03 18:13:46'),
(41, 11, 'be7cab3051e11bb9258b269fad2acb166d1f97189c6b8fdd7e8542ccbe654920', '2025-07-10 18:16:21', '2025-07-03 18:16:21'),
(42, 11, '327300225fa11cdbf3222aca660c08d3606085e9e1d093614fb92adc0c9bc3f3', '2025-07-10 18:17:11', '2025-07-03 18:17:11'),
(43, 11, '828ebe9016f427bd62cf1710f57ffa0c1ae96689fbd3f8e33c6002b943cf81e1', '2025-07-10 18:19:49', '2025-07-03 18:19:49'),
(44, 11, 'e93cbd64a885ff6ac5fc93a303bd70c687656816b169ed82df94c4f2d123706e', '2025-07-10 18:20:56', '2025-07-03 18:20:56'),
(45, 11, 'ca8b9a1276b915cc58040da1977d236e8f69b0969a849b2af68294b211515d4d', '2025-07-10 18:23:29', '2025-07-03 18:23:29'),
(46, 11, 'cdd2d134249200aec6fe77712137747533f6dcecbda53b012f5f2b7bede06b32', '2025-07-10 18:24:30', '2025-07-03 18:24:30'),
(47, 11, '3ad5f2985ddd4aba3086d97a1f4e4a49c670df1e26e3102bd4b1d447af3295b1', '2025-07-10 18:28:14', '2025-07-03 18:28:14'),
(48, 11, '0da26d3c2dcbb41c59de7bc2aaab3b9fef3f4843afbc2e79428dc1f9c82c68f5', '2025-07-10 18:32:55', '2025-07-03 18:32:55'),
(49, 11, '3d5adc5ab0d3ce25bd1af188769f9d2f5d8096ef92184b02186e047474a9c6f8', '2025-07-10 23:48:10', '2025-07-03 23:48:10'),
(50, 11, '4a50d81a78fc4d434e4ea3c81c4be4b64dd1e3d53e33f6861caaca13cab63292', '2025-07-10 23:50:47', '2025-07-03 23:50:47'),
(51, 11, 'e228b4454544105fdce2b6aa223cd4feb459448b2a5e0636398964a08fbfca3a', '2025-07-10 23:53:46', '2025-07-03 23:53:46'),
(52, 11, '9f6970655080c8695ee9afcb53a97f3470f9b029aa49a4efdd4d9d43722540f5', '2025-07-11 00:00:35', '2025-07-04 00:00:35'),
(53, 11, '7a0225988d3b874a72d97e92b6a957278d07893d99eb9448c576b4638f220bc6', '2025-07-11 00:05:54', '2025-07-04 00:05:54'),
(54, 11, '6f8a89c5c2f38df53665b11dac445597d104d0c91f726c651aef781003cbc558', '2025-07-11 00:18:43', '2025-07-04 00:18:43'),
(55, 11, '8cbfceafefd1c4df52002d998a3c3ca08cb30fff33fb425756335c690a129a9c', '2025-07-11 00:37:50', '2025-07-04 00:37:50'),
(56, 11, '7c307a0fcd1cffff1c405ef14748ae0a9517d8247ac49d25ea6c003f2e7da1b0', '2025-07-11 00:39:54', '2025-07-04 00:39:54'),
(57, 11, '3f27f92316a3a941e010382ac80c6ce3465ec0975c9611f30dbab14a83eb2f66', '2025-07-11 00:41:59', '2025-07-04 00:41:59'),
(58, 11, '2409f23f8aea3e379e18867ce3b707ec31b86d1aa65e93e6ebfa8c5565614883', '2025-07-11 00:49:10', '2025-07-04 00:49:10'),
(59, 11, '2e142a30c7484a39a784c94863dc355c76580acab6e49c11b2650c6cc8e04718', '2025-07-11 05:26:42', '2025-07-04 05:26:42'),
(60, 11, '37e9eae5f920e71cdfbd31dbbcfa6777013185af241be37f26275f6fcfabbd65', '2025-07-11 05:29:39', '2025-07-04 05:29:39'),
(61, 11, 'dc035c4430115b16f145c726cb6dad14eb1c30ee1e0f4f1518966bc92445c064', '2025-07-11 05:31:52', '2025-07-04 05:31:52'),
(62, 11, '5deb0912ee341f7b70037f65d561f37b6329f57f842fb65b253c6c2966509653', '2025-07-11 05:36:02', '2025-07-04 05:36:02'),
(63, 11, 'e2c515143d13cdf1f9e6d8eeab7dedbfa600fe6ad9f1095f1e091450404e3030', '2025-07-11 05:39:39', '2025-07-04 05:39:39'),
(64, 11, 'd84e8db2dacc4beed4d89904cc5a43184168470b98c7abcabef4ce4d5955e52e', '2025-07-11 05:44:52', '2025-07-04 05:44:52'),
(65, 11, 'b2c207491d4a8e61b8748e640606182ae1acafcf76d68d81528fb17d6ebe365f', '2025-07-11 05:48:20', '2025-07-04 05:48:20'),
(66, 11, 'ab448d5151c6289d4005a9d44a9b82306c91970e6a0df7826e6b6b36b024f845', '2025-07-11 05:51:28', '2025-07-04 05:51:28'),
(67, 11, 'b4990d32de960c53808d0ab1e7d0f0b25aaf84892fe52cce3e0a72022a1fadc8', '2025-07-11 05:56:10', '2025-07-04 05:56:10'),
(68, 11, '9693a89f4f704111eea23546cc2b488689c24e76e3995dc41fb68e1935228ddf', '2025-07-11 05:58:39', '2025-07-04 05:58:39'),
(69, 11, '071b5b488fb3f18981f7a33c8156b395909045f4ed38204df581baf0b1c3be64', '2025-07-11 06:01:13', '2025-07-04 06:01:13'),
(70, 11, 'd6f802b53af594fcf7f44d27a729680f393cacc94f956e3a90e1f13330f44aec', '2025-07-11 06:05:38', '2025-07-04 06:05:38'),
(71, 11, 'aa4b12649df98128673afe371b7a6a0c8d925b051e3dda55c6aa6a904eeb4d6c', '2025-07-11 06:09:37', '2025-07-04 06:09:37'),
(72, 11, '6a453a4c79c39e46932d9a04e1720cbf995f755883e99e5f585f752e7840ed34', '2025-07-11 06:10:53', '2025-07-04 06:10:53'),
(74, 11, '90dcf2b2a195def419ccc67ad4f7f6d5cbee551bed2266fa93e72039a796623a', '2025-07-11 23:42:04', '2025-07-04 23:42:04'),
(76, 11, '67294d9ba713e027da46da54b856c5b279bac6a513a8c7279b90d64591337421', '2025-07-11 23:52:21', '2025-07-04 23:52:21'),
(77, 11, '9acabdc5126bc84b9ce0636dcd576f68d953525c6dd932adcd17a8aabaa87c74', '2025-07-12 00:00:09', '2025-07-05 00:00:09'),
(78, 11, 'a0a0e3d8c0d7bb62853b10df459d876b9400eb88f39995a95bb605fbb1324e41', '2025-07-12 00:21:21', '2025-07-05 00:21:21'),
(79, 11, '2dd6a967720ab940711b7aa0705abb4a32ddaf99fc986be5df860c242d977554', '2025-07-12 00:35:05', '2025-07-05 00:35:05'),
(80, 11, 'f124c2b6aaac058f47dc03343f22e1dfd6c56df60c45e2e4f838f3fdfeaae1ec', '2025-07-12 00:42:47', '2025-07-05 00:42:47'),
(81, 11, '444f3a625611abd66b5a49e26f973827d5ff6a76d489ba1f5241fcf74a85f172', '2025-07-12 00:51:39', '2025-07-05 00:51:39'),
(82, 11, 'f373b54f741ee3db30a19c8d43c81ade4f825efc8fd65443e97555c0a6adee47', '2025-07-12 00:54:25', '2025-07-05 00:54:25'),
(83, 11, 'bdf88cbfb23bc47aa1645b0911597b1eb3bc80b15b94bb5dce8052a8720bc9e0', '2025-07-12 00:56:52', '2025-07-05 00:56:52'),
(84, 11, '5deb1780a50097041d380fea6455736f43f6843b20fb77fe8afaf1c15c308315', '2025-07-12 00:57:54', '2025-07-05 00:57:54'),
(85, 11, 'c393b2af5df2d5c43e394bace67982a072ae10a97394e3788e114c165baa011c', '2025-07-12 00:59:23', '2025-07-05 00:59:23'),
(86, 11, '2fa175d69849707cc95438c229ca146b5585685921caf14f99498e359aac5a70', '2025-07-12 01:02:08', '2025-07-05 01:02:08'),
(87, 11, 'f4d06d137c5e2ef18dc991402266f1b0b473ebc98c7de4c551295b6a19faffde', '2025-07-12 01:03:23', '2025-07-05 01:03:23'),
(88, 11, 'a29a7d234828eb48b9905dc531580c21804fdceccb3e738a63036c868bdc74d0', '2025-07-12 01:06:09', '2025-07-05 01:06:09'),
(89, 11, '47214b12ba8563994c38865270f3ba5b9f57d7c05c206c061bd4fa29ac8e8216', '2025-07-12 01:08:24', '2025-07-05 01:08:24'),
(90, 11, '6b9bcb40d524eaf74f75e8e724f5a6df0a9620fc67e2b1d8ffe6b640966b979a', '2025-07-12 01:12:15', '2025-07-05 01:12:15'),
(91, 11, 'fc7a2558fe0a698eb7373d0318d9b1313f952123193759aa5cc05e1695a36167', '2025-07-12 01:13:43', '2025-07-05 01:13:43'),
(92, 11, '0af5adf5bd9eca1425a62deed778140fc02849e750e837dd623a51733eac8df1', '2025-07-12 01:19:26', '2025-07-05 01:19:26'),
(93, 11, 'b74ff9b9fc0b87885d1e65ee7da1e3eff9b85413d0f7b358a7bf477b93936556', '2025-07-12 01:25:13', '2025-07-05 01:25:13'),
(98, 11, '12e4cf5ba4b1b47e8b9856238f92e5aee4cb857e4d01412291fc7da441717af6', '2025-07-13 11:24:51', '2025-07-06 11:24:51'),
(99, 11, 'f6875ede57e213d4bc163a55263a71e0f98751c35df8ac1416ba66859c9808c9', '2025-07-13 11:29:57', '2025-07-06 11:29:57'),
(100, 11, '4d4a7d5fdfefa14c0b13205be204f4a2f049701aa09eae972eb1c617a6dd1622', '2025-07-15 01:56:12', '2025-07-08 01:56:12'),
(102, 11, '3f3bc4c7d6c9ed49652fa28fd4eb228e1490b924e38313f19e532a178e4a338d', '2025-07-15 02:05:55', '2025-07-08 02:05:55'),
(104, 11, 'b92bbd6cf7aff7cdbea49e1ef0ec0cf307fd3477d68a77d9c1e73c8ff66d2c43', '2025-07-15 11:21:55', '2025-07-08 11:21:55'),
(118, 11, 'c9efbe01593f83522f7c8a36631ab89cdab23e49b8cb59a7b9248e9c5c893fee', '2025-07-16 04:42:42', '2025-07-09 04:42:42'),
(123, 23, '0a8e6ed4d4b21334201dab44eaaa3cae639d6998ff154ea3a92ce67ef3272fcc', '2025-07-21 01:22:03', '2025-07-14 01:22:03'),
(126, 11, '346a35a1d318547142dd1cd38d6250a4e2dc96896aa53e4553b1c7a77190ed6c', '2025-07-27 05:51:53', '2025-07-20 05:51:53'),
(129, 11, 'c0848bb4ca2000d9a379acf3098f2324aee685a68516aad16b11ec65fc54e13c', '2025-07-27 09:53:46', '2025-07-20 09:53:46'),
(131, 11, '466e45402d8cc3e8dde02d7d422bac4f8df7532f26a1349b463221c81a1bcb7d', '2025-07-27 12:37:55', '2025-07-20 12:37:55'),
(133, 11, '05898a12ef805edf1340984e0f09226fab66760fc07d3e4636225ada2acc9f47', '2025-07-31 05:00:22', '2025-07-24 05:00:22'),
(135, 11, '376e9763926ec56f704e6b32137ce17971d76dee4550fc42fead99bd5c7d4527', '2025-07-31 05:15:52', '2025-07-24 05:15:52'),
(136, 11, '819ed824d67062f0515267f816c7d7f6eec35881d901fff69567581d28ebe0b4', '2025-07-31 05:17:26', '2025-07-24 05:17:26'),
(137, 11, 'c0ae6e67eb1c8a368c5a790c3402a9665b10e9357c2ea74b62218b4aabd788cc', '2025-07-31 05:20:47', '2025-07-24 05:20:47'),
(138, 11, '52bc7ea07b0bddd20872448311984f27c84e6c1296094b9cda3f27dee733ee3c', '2025-07-31 05:21:21', '2025-07-24 05:21:21'),
(139, 11, '2b65d63b674ed163d9935dd73683a207c54755d95becebd041599f6fe948e3b8', '2025-07-31 05:23:03', '2025-07-24 05:23:03'),
(140, 11, 'f0d80ef639b4e232e549a65775ceafbc04e2d0dbf99e947dc44f7645af3914f5', '2025-07-31 05:26:01', '2025-07-24 05:26:01'),
(141, 11, '69fb2e5317f5a18c8a3636e188b914372643b512c8acd39ac8901891f31d753d', '2025-07-31 05:27:30', '2025-07-24 05:27:30'),
(142, 11, '5ecbb76ddac009eefc919ea59444cc4277f0d609563c93e7575dda678ebdb70a', '2025-07-31 05:31:14', '2025-07-24 05:31:14'),
(145, 26, '2bf79e9ac1acb3a3ddb03f58812b530a89923dcb3e62462bb33ee95e7bf5e9c6', '2025-07-31 06:07:44', '2025-07-24 06:07:44'),
(147, 22, '3d9b4f9158b5b1ebfbeffdbd6928f5d8aadb13bebe6b1b560ca8b80f700e9c1a', '2025-07-31 06:33:24', '2025-07-24 06:33:24'),
(148, 22, '5b62af457909ade1215a01167ea272549017d3493bb96f03f76a9f12e43f8e9e', '2025-07-31 06:39:56', '2025-07-24 06:39:56'),
(149, 22, 'e82db860d8538e4f3b5d35af52534e76ac9ef267eb8eda4712d8ffb2d218abe5', '2025-07-31 06:41:46', '2025-07-24 06:41:46'),
(150, 22, '02ccac7035b62c286e46df982bf13dcbbf0a924ed05718718df3d3ecafe68b12', '2025-07-31 06:43:12', '2025-07-24 06:43:12'),
(151, 22, 'af90e518fbd0476e9cb0f68425a7bc7dc1ad816c2a65853b120aeffde21b1ef5', '2025-07-31 06:47:21', '2025-07-24 06:47:21'),
(155, 11, 'c4d9632984660d1e25fc9e68ff9ff08ac9aea1f8a400eb70648349acde786b6d', '2025-07-31 06:59:11', '2025-07-24 06:59:11'),
(156, 22, '07daab51ce64489850dc27a63b5660a7fd31f97cb1b94a02a2337d5cb8aec836', '2025-07-31 07:04:02', '2025-07-24 07:04:02'),
(160, 22, 'ca8da8899cb9d4537e6962ab8e5e55ae180663a31e6a3760a6efb4361f8c0a81', '2025-07-31 07:14:52', '2025-07-24 07:14:52'),
(166, 11, 'd42e5c3af024b191f13905019621b85a04e2319b3000f8127f814c0f46eab7de', '2025-07-31 07:29:30', '2025-07-24 07:29:30'),
(168, 11, '79b32ee936bdc7dfc74a2c4ad4cf476bb44c7f7878f73475ffe323457e1241fa', '2025-07-31 07:42:35', '2025-07-24 07:42:35'),
(169, 22, '05ff877a710655d4e4f70120cfd1c87fd4020de59ffa0ed572713e44f1f534ef', '2025-07-31 07:42:57', '2025-07-24 07:42:57'),
(170, 22, '9efae0062b82f55f324bcf4288c5e384b54c81b9cc7635ed319c3709e6668cb9', '2025-07-31 07:52:39', '2025-07-24 07:52:39'),
(173, 11, '593859892932f0f535ccc869ca095b505dda82644259a19221a99092052697ae', '2025-08-03 08:49:12', '2025-07-27 08:49:12');

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
  `otp_expiry` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `username`, `email`, `contact_number`, `role`, `account_status`, `password_hash`, `created_at`, `updated_at`, `reset_otp`, `otp_expiry`) VALUES
(11, 'Mark', 'Laurence', 'Mark', 'marktiktok525@gmail.com', '09999999999', 'User', 'active', '$2b$10$lr.Qtvu1ML2FyxojlXReC.PDu.f1cUcBBePOUSVwv05zKITn0uXP.', '2025-07-03 15:39:36', '2025-07-28 05:12:47', NULL, NULL),
(22, 'mark', 'caringal', 'ybaha', 'marklaurencecaringal1@gmail.com', '09848705548', 'User', 'active', '$2b$10$E5UDZC47ReShfI3t.HqrteQSg2pVWUL3On1s6DxhNtR5EjllVQ1h6', '2025-07-14 02:32:59', '2025-07-24 06:30:09', NULL, NULL),
(23, 'ee', 'User', 'ee', 'ee@gmail.com', NULL, 'User', 'active', '$2b$10$0nlymAoDDwtoP1c3Mb47ceX0kQkQ7cRzs9j562e6b70Tej9uHnHVS', '2025-07-14 01:21:46', '2025-07-14 01:21:46', NULL, NULL),
(26, 'marklaurencecaringal7', 'User', 'marklaurencecaringal7', 'marklaurencecaringal7@gmail.com', NULL, 'User', 'active', '$2b$10$v/UGBamzRN3ig2KtwWCwIeOVYr1L1NZNDJ/.EyJUvIG02EB5pmDUG', '2025-07-09 05:56:06', '2025-07-24 06:13:23', '913532', '2025-07-24 14:16:25'),
(30, 'mark', 'baa', 'abna', 'hahah@gmail.com', '098558758668', 'User', 'active', '$2b$10$fXQKRY.ung923C23Rq7cL.DmAT94N01TF8p2NsFkdgs7a0ngPo3CS', '2025-07-20 12:37:39', '2025-07-20 12:37:39', NULL, NULL),
(31, 'Mark', 'Laurence', 'Markll', 'benzoncarl010@gmail.com', '0998484484', 'User', 'active', '$2b$10$9pJqr6UQIVU7qhIhJBcKDONXwMAxsDpWgMlMrK8p9HmZ9CRudzGTS', '2025-07-28 05:07:03', '2025-07-28 05:08:22', NULL, NULL);

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
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=176;

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
