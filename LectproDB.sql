-- Table: teachers
CREATE TABLE teachers (
                          id INT PRIMARY KEY AUTO_INCREMENT,
                          first_name VARCHAR(255),
                          last_name VARCHAR(255),
                          user_name VARCHAR(255),
                          pass VARCHAR(255)
);

-- Table: students
CREATE TABLE students (
                          id INT PRIMARY KEY AUTO_INCREMENT,
                          first_name VARCHAR(255),
                          last_name VARCHAR(255),
                          user_name VARCHAR(255),
                          pass VARCHAR(255),
                          project_id INT,
                          FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Table: projects
CREATE TABLE projects (
                          id INT PRIMARY KEY AUTO_INCREMENT,
                          title VARCHAR(255),
                          description TEXT,
                          student_id1 INT,
                          student_id2 INT,
                          stage_count INT,
                          grade INT,
                          FOREIGN KEY (student_id1) REFERENCES students(id),
                          FOREIGN KEY (student_id2) REFERENCES students(id)
);

-- Table: stages
CREATE TABLE stages (
                        id INT PRIMARY KEY AUTO_INCREMENT,
                        project_id INT,
                        title VARCHAR(255),
                        FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Table: comments
CREATE TABLE comments (
                          id INT PRIMARY KEY AUTO_INCREMENT,
                          text TEXT,
                          stage_id INT,
                          is_done BOOLEAN,
                          FOREIGN KEY (stage_id) REFERENCES stages(id)
);

-- Table: projects_technologies
CREATE TABLE projects_technologies (
                                       project_id INT,
                                       technology_id INT,
                                       PRIMARY KEY (project_id, technology_id),
                                       FOREIGN KEY (project_id) REFERENCES projects(id),
                                       FOREIGN KEY (technology_id) REFERENCES technology_in_use(id)
);

-- Table: files
CREATE TABLE files (
                       id INT PRIMARY KEY AUTO_INCREMENT,
                       routing VARCHAR(255),
                       stage_id INT,
                       FOREIGN KEY (stage_id) REFERENCES stages(id)
);

-- Table: technology_in_use
CREATE TABLE technology_in_use (
                                   id INT PRIMARY KEY AUTO_INCREMENT,
                                   title VARCHAR(255),
                                   language VARCHAR(255)
);
-- to Add: users!!!