-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 05, 2025 at 07:24 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lectpro`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `text` text DEFAULT NULL,
  `is_done` tinyint(1) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `section` varchar(255) NOT NULL,
  `page` int(11) NOT NULL,
  `user_response` text NOT NULL,
  `done_by_user` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `text`, `is_done`, `project_id`, `title`, `section`, `page`, `user_response`, `done_by_user`) VALUES
(12, '1', 1, 2, '1000ל', '1', 1, '1', 1),
(14, '3', 1, 2, '3060', '3', 3, '3', 1),
(15, '4', 1, 2, '4', '4', 4, '4', 1),
(16, '5', 1, 2, '5', '5', 5, '5', 1),
(17, '8', 1, 2, '8', '8', 8, '8', 1),
(18, '9', 1, 2, '9', '9', 9, '9', 1),
(19, '50', 1, 2, '50', '50', 50, '50', 1),
(20, '3', 0, 2, '3', '3', 3, '', NULL),
(21, '6', 1, 2, '6', '6', 6, '48+56', 1),
(22, '80', 1, 2, '80', '80', 80, '80', 1),
(23, '9', 1, 2, '9', '9', 9, '+63', 1),
(28, '1', 1, 1, '1', '1', 1, '888', 1),
(29, '2\n', 1, 1, '24', '25', 28, 'חרא עליך', 1),
(30, '5', 1, 1, '580', '5', 5, '9עוןנחל', 1),
(34, '9', 1, 1, 'thnal cdcx', '9', 9, 'vbyuswnkmd', 1),
(35, '10', 1, 1, '10', '10', 10, 'vuyhbj m', 1),
(36, '11', 1, 1, '11', '11', 11, 'uuuu', 1),
(37, '88', 1, 1, '88', '88', 88, 'crtfg bn', 1),
(38, '33', 0, 1, '33', '33', 33, 'yyyyyyyy', 1),
(39, '96', 0, 1, '96', '96', 96, 'ggggggggg', 1),
(40, '0', 0, 1, '0', '0', 0, '000000000000000000000000', 1),
(41, 'j', 1, 1, 'k', 'u', 5, 'rrt bn', 1),
(43, '6', 0, 1, '6', 'pvgn', 6, '', NULL),
(44, '6', 0, 1, '6', 'x6erdcyb', 6, '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`) VALUES
(1, 'הנדסת תוכנה'),
(4, 'הנדסת חשמל');

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `id` int(11) NOT NULL,
  `routing` varchar(255) DEFAULT NULL,
  `stage_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `instructor`
--

CREATE TABLE `instructor` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `pass` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 0,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `department_id` int(11) DEFAULT NULL,
  `forgot_password` varchar(255) DEFAULT NULL,
  `reset_password_expires` datetime DEFAULT NULL,
  `must_change_password` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `instructor`
--

INSERT INTO `instructor` (`id`, `first_name`, `last_name`, `user_name`, `pass`, `email`, `phone`, `is_active`, `is_admin`, `department_id`, `forgot_password`, `reset_password_expires`, `must_change_password`) VALUES
(1, 'n', 'n', 'n', '5f9f16a23e4c4a64bc9854e24e9b6cd2', 'natipinyan@gmail.com', '055', 1, 0, 1, NULL, NULL, 0),
(2, 'l', 'l', 'l', '5f9f16a23e4c4a64bc9854e24e9b6cd2', 'l@l', '6521', 1, 1, 1, NULL, NULL, 0),
(8, 'm', 'm', 'm', '5f9f16a23e4c4a64bc9854e24e9b6cd2', 'm@m', '041', 1, 0, 1, NULL, NULL, 0),
(11, 'amir', 'amitr', 'amir', '5f9f16a23e4c4a64bc9854e24e9b6cd2', 'm@ubyhj', '0562', 1, 1, 4, NULL, NULL, 0),
(12, 'f', 'f', 'f', '5f9f16a23e4c4a64bc9854e24e9b6cd2', 'f@f', '658', 1, 0, 4, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `student_id1` int(11) DEFAULT NULL,
  `student_id2` int(11) DEFAULT NULL,
  `stage_count` int(11) DEFAULT NULL,
  `grade` int(11) DEFAULT NULL,
  `link_to_github` varchar(255) DEFAULT NULL,
  `instructor_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `title`, `description`, `student_id1`, `student_id2`, `stage_count`, `grade`, `link_to_github`, `instructor_id`, `department_id`) VALUES
(1, 'lectpro', 'aaa', 11, NULL, 6, NULL, 'https://github.com/Natipinyan/Lectpro', 1, 1),
(2, 'mike', 'a', 12, NULL, 3, NULL, NULL, 1, 1),
(5, 'ט', 'ט', 12, NULL, NULL, NULL, NULL, 1, 1),
(6, 'd', 'td', 12, NULL, NULL, NULL, NULL, 1, 4),
(9, 'p', 'k', 12, NULL, NULL, NULL, NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `projects_technologies`
--

CREATE TABLE `projects_technologies` (
  `project_id` int(11) NOT NULL,
  `technology_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects_technologies`
--

INSERT INTO `projects_technologies` (`project_id`, `technology_id`) VALUES
(1, 17),
(1, 19),
(1, 20),
(2, 2),
(5, 20),
(6, 1),
(9, 1);

-- --------------------------------------------------------

--
-- Table structure for table `stages`
--

CREATE TABLE `stages` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `position` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stages`
--

INSERT INTO `stages` (`id`, `title`, `department_id`, `position`) VALUES
(2, 'העלאת מסמך', 1, 1),
(3, 'העלאת קוד', 1, 2),
(4, 'אישור מסמך', 1, 4),
(5, 'העלאת פי די אף', 1, 3),
(6, 'אישור קוד', 1, 5),
(18, 'jrt', 1, 6),
(20, 'הרקג\'', 1, 7),
(24, 'עמכנה', 1, 8);

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `pass` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `project_id` int(11) DEFAULT NULL,
  `forgot_password` varchar(255) DEFAULT NULL,
  `reset_password_expires` datetime DEFAULT NULL,
  `must_change_password` tinyint(1) DEFAULT 0,
  `department_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `first_name`, `last_name`, `user_name`, `pass`, `email`, `phone`, `project_id`, `forgot_password`, `reset_password_expires`, `must_change_password`, `department_id`) VALUES
(11, 'nati', 'pinyannnnnnn', 'nati', '5f9f16a23e4c4a64bc9854e24e9b6cd2', 'natipinyan@gmail.com', '05', NULL, NULL, NULL, 0, 1),
(12, 'mikel', 'hemo', 'mikel', '5f9f16a23e4c4a64bc9854e24e9b6cd2', 'm@m', '0984', 2, NULL, NULL, 0, 1),
(13, 'e', 'e', 'e', '5f9f16a23e4c4a64bc9854e24e9b6cd2', 'e@E', '050', NULL, NULL, NULL, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `technology_in_use`
--

CREATE TABLE `technology_in_use` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `technology_in_use`
--

INSERT INTO `technology_in_use` (`id`, `title`, `language`, `department_id`) VALUES
(1, 'data base', 'mysql2', 1),
(2, 'frontend', 'react', 1),
(12, 'frontend', 'ו', 1),
(14, 'backend', 'ndciswk', 1),
(17, 'frontend', 'p', 1),
(19, 'frontend', 't', 1),
(20, 'frontend', 'ppppppppp', 1),
(21, 'frontend', 'א', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comments_fk_project` (`project_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stage_id` (`stage_id`);

--
-- Indexes for table `instructor`
--
ALTER TABLE `instructor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_instructor_department` (`department_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id1` (`student_id1`),
  ADD KEY `student_id2` (`student_id2`),
  ADD KEY `fk_instructor` (`instructor_id`),
  ADD KEY `fk_projects_department` (`department_id`);

--
-- Indexes for table `projects_technologies`
--
ALTER TABLE `projects_technologies`
  ADD PRIMARY KEY (`project_id`,`technology_id`),
  ADD KEY `technology_id` (`technology_id`);

--
-- Indexes for table `stages`
--
ALTER TABLE `stages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_stages_department` (`department_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_project` (`project_id`),
  ADD KEY `fk_student_department` (`department_id`);

--
-- Indexes for table `technology_in_use`
--
ALTER TABLE `technology_in_use`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_technology_department` (`department_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `instructor`
--
ALTER TABLE `instructor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `stages`
--
ALTER TABLE `stages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `technology_in_use`
--
ALTER TABLE `technology_in_use`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_fk_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `files`
--
ALTER TABLE `files`
  ADD CONSTRAINT `files_ibfk_1` FOREIGN KEY (`stage_id`) REFERENCES `stages` (`id`);

--
-- Constraints for table `instructor`
--
ALTER TABLE `instructor`
  ADD CONSTRAINT `fk_instructor_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `fk_instructor` FOREIGN KEY (`instructor_id`) REFERENCES `instructor` (`id`),
  ADD CONSTRAINT `fk_projects_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`student_id1`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`student_id2`) REFERENCES `students` (`id`);

--
-- Constraints for table `projects_technologies`
--
ALTER TABLE `projects_technologies`
  ADD CONSTRAINT `projects_technologies_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  ADD CONSTRAINT `projects_technologies_ibfk_2` FOREIGN KEY (`technology_id`) REFERENCES `technology_in_use` (`id`);

--
-- Constraints for table `stages`
--
ALTER TABLE `stages`
  ADD CONSTRAINT `fk_stages_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `fk_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  ADD CONSTRAINT `fk_student_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `technology_in_use`
--
ALTER TABLE `technology_in_use`
  ADD CONSTRAINT `fk_technology_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
