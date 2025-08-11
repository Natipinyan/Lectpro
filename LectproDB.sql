CREATE DATABASE IF NOT EXISTS `lectpro` DEFAULT CHARACTER SET utf8mb4 COLLATE=utf8mb4_general_ci;
USE `lectpro`;

DROP TABLE IF EXISTS `projects_technologies`, `comments`, `files`, `stages`, `projects`,
    `students`, `instructor`, `technology_in_use`;

CREATE TABLE `students` (
                            `id` int(11) NOT NULL AUTO_INCREMENT,
                            `first_name` varchar(255) DEFAULT NULL,
                            `last_name` varchar(255) DEFAULT NULL,
                            `user_name` varchar(255) DEFAULT NULL,
                            `pass` varchar(255) DEFAULT NULL,
                            `email` varchar(255) NOT NULL,
                            `phone` varchar(15) NOT NULL,
                            `project_id` int(11) DEFAULT NULL,
                            `forgot_password` varchar(255) DEFAULT NULL,
                            `reset_password_expires` DATETIME DEFAULT NULL,
                            `must_change_password` BOOLEAN DEFAULT FALSE,
                            PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `instructor` (
                              `id` int(11) NOT NULL AUTO_INCREMENT,
                              `first_name` varchar(255) DEFAULT NULL,
                              `last_name` varchar(255) DEFAULT NULL,
                              `user_name` varchar(255) DEFAULT NULL,
                              `pass` varchar(255) DEFAULT NULL,
                              `email` varchar(255) NOT NULL,
                              `phone` varchar(15) NOT NULL,
                              `forgot_password` varchar(255) DEFAULT NULL,
                              `reset_password_expires` DATETIME DEFAULT NULL,
                              `must_change_password` BOOLEAN DEFAULT FALSE,
                              `is_active` BOOLEAN DEFAULT TRUE,
                              PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `projects` (
                            `id` int(11) NOT NULL AUTO_INCREMENT,
                            `title` varchar(255) DEFAULT NULL,
                            `description` text DEFAULT NULL,
                            `student_id1` int(11) DEFAULT NULL,
                            `student_id2` int(11) DEFAULT NULL,
                            `stage_count` int(11) DEFAULT NULL,
                            `grade` int(11) DEFAULT NULL,
                            `link_to_github` VARCHAR(255) NULL DEFAULT NULL,
                            PRIMARY KEY (`id`),
                            KEY `student_id1` (`student_id1`),
                            KEY `student_id2` (`student_id2`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `stages` (
                          `id` int(11) NOT NULL AUTO_INCREMENT,
                          `project_id` int(11) DEFAULT NULL,
                          `title` varchar(255) DEFAULT NULL,
                          PRIMARY KEY (`id`),
                          KEY `project_id` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `comments` (
                            `id` int(11) NOT NULL AUTO_INCREMENT,
                            `title` varchar(255) NOT NULL,
                            `text` text NOT NULL,
                            `project_id` int(11) DEFAULT NULL,
                            `section` varchar(255) NOT NULL,
                            `page` int(11) NOT NULL,
                            `is_done` tinyint(1) DEFAULT 0,
                            `done_by_user` tinyint(1) DEFAULT 0,
                            PRIMARY KEY (`id`),
                            KEY `project_id` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `files` (
                         `id` int(11) NOT NULL AUTO_INCREMENT,
                         `routing` varchar(255) DEFAULT NULL,
                         `project_id` int(11) DEFAULT NULL,
                         PRIMARY KEY (`id`),
                         KEY `project_id` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `technology_in_use` (
                                     `id` int(11) NOT NULL AUTO_INCREMENT,
                                     `title` varchar(255) DEFAULT NULL,
                                     `language` varchar(255) DEFAULT NULL,
                                     PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `projects_technologies` (
                                         `project_id` int(11) NOT NULL,
                                         `technology_id` int(11) NOT NULL,
                                         PRIMARY KEY (`project_id`,`technology_id`),
                                         KEY `technology_id` (`technology_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `projects`
    ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`student_id1`) REFERENCES `students` (`id`),
    ADD CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`student_id2`) REFERENCES `students` (`id`);

ALTER TABLE `stages`
    ADD CONSTRAINT `stages_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`);

ALTER TABLE `comments`
    ADD CONSTRAINT `comments_fk_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

ALTER TABLE `files`
    ADD CONSTRAINT `files_fk_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

ALTER TABLE `projects_technologies`
    ADD CONSTRAINT `projects_technologies_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
    ADD CONSTRAINT `projects_technologies_ibfk_2` FOREIGN KEY (`technology_id`) REFERENCES `technology_in_use` (`id`);

ALTER TABLE `students`
    ADD CONSTRAINT `fk_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`);
