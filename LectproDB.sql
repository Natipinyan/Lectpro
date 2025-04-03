SET
SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET
time_zone = "+00:00";

SET NAMES utf8mb4;

CREATE TABLE `comments`
(
    `id`       int(11) NOT NULL,
    `text`     text DEFAULT NULL,
    `stage_id` int(11) DEFAULT NULL,
    `is_done`  tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `files`
(
    `id`       int(11) NOT NULL,
    `routing`  varchar(255) DEFAULT NULL,
    `stage_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `projects`
(
    `id`          int(11) NOT NULL,
    `title`       varchar(255) DEFAULT NULL,
    `description` text         DEFAULT NULL,
    `student_id1` int(11) DEFAULT NULL,
    `student_id2` int(11) DEFAULT NULL,
    `stage_count` int(11) DEFAULT NULL,
    `grade`       int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `projects_technologies`
(
    `project_id`    int(11) NOT NULL,
    `technology_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `stages`
(
    `id`         int(11) NOT NULL,
    `project_id` int(11) DEFAULT NULL,
    `title`      varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `students`
(
    `id`         int(11) NOT NULL,
    `first_name` varchar(255) DEFAULT NULL,
    `last_name`  varchar(255) DEFAULT NULL,
    `user_name`  varchar(255) DEFAULT NULL,
    `pass`       varchar(255) DEFAULT NULL,
    `email`      varchar(255) NOT NULL,
    `phone`      varchar(15)  NOT NULL,
    `project_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `teachers`
(
    `id`         int(11) NOT NULL,
    `first_name` varchar(255) DEFAULT NULL,
    `last_name`  varchar(255) DEFAULT NULL,
    `user_name`  varchar(255) DEFAULT NULL,
    `pass`       varchar(255) DEFAULT NULL,
    `email`      varchar(255) NOT NULL,
    `phone`      varchar(15)  NOT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `technology_in_use`
(
    `id`       int(11) NOT NULL,
    `title`    varchar(255) DEFAULT NULL,
    `language` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `comments`
    ADD PRIMARY KEY (`id`), ADD KEY `stage_id` (`stage_id`);
ALTER TABLE `files`
    ADD PRIMARY KEY (`id`), ADD KEY `stage_id` (`stage_id`);
ALTER TABLE `projects`
    ADD PRIMARY KEY (`id`), ADD KEY `student_id1` (`student_id1`), ADD KEY `student_id2` (`student_id2`);
ALTER TABLE `projects_technologies`
    ADD PRIMARY KEY (`project_id`, `technology_id`), ADD KEY `technology_id` (`technology_id`);
ALTER TABLE `stages`
    ADD PRIMARY KEY (`id`), ADD KEY `project_id` (`project_id`);
ALTER TABLE `students`
    ADD PRIMARY KEY (`id`), ADD KEY `fk_project` (`project_id`);
ALTER TABLE `teachers`
    ADD PRIMARY KEY (`id`);
ALTER TABLE `technology_in_use`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `comments` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `files` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `projects` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `stages` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `students` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `teachers` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `technology_in_use` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `comments`
    ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`stage_id`) REFERENCES `stages` (`id`);
ALTER TABLE `files`
    ADD CONSTRAINT `files_ibfk_1` FOREIGN KEY (`stage_id`) REFERENCES `stages` (`id`);
ALTER TABLE `projects`
    ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`student_id1`) REFERENCES `students` (`id`), ADD CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`student_id2`) REFERENCES `students` (`id`);
ALTER TABLE `projects_technologies`
    ADD CONSTRAINT `projects_technologies_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`), ADD CONSTRAINT `projects_technologies_ibfk_2` FOREIGN KEY (`technology_id`) REFERENCES `technology_in_use` (`id`);
ALTER TABLE `stages`
    ADD CONSTRAINT `stages_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`);
ALTER TABLE `students`
    ADD CONSTRAINT `fk_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`);

COMMIT;
