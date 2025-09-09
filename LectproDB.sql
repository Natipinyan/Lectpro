-- Create the database and use it
CREATE DATABASE lectpro;
GO
USE lectpro;
GO

-- -----------------------------
-- Table: Departments
-- -----------------------------
CREATE TABLE departments (
                             id INT IDENTITY(1,1) PRIMARY KEY, -- Primary key, auto-increment
                             name VARCHAR(255) NOT NULL         -- Department name
);
GO

-- -----------------------------
-- Table: Students
-- -----------------------------
CREATE TABLE students (
                          id INT IDENTITY(1,1) PRIMARY KEY,  -- Primary key, auto-increment
                          first_name VARCHAR(255),            -- Student's first name
                          last_name VARCHAR(255),             -- Student's last name
                          user_name VARCHAR(255),             -- Username
                          pass VARCHAR(255),                  -- Password
                          email VARCHAR(255) NOT NULL,        -- Email
                          phone VARCHAR(15),                  -- Phone number
                          project_id INT NULL,                -- FK to projects.id (nullable)
                          department_id INT NULL,             -- FK to departments.id (nullable)
                          forgot_password VARCHAR(255),       -- Forgot password token
                          reset_password_expires DATETIME,    -- Reset password expiration
                          must_change_password BIT            -- Flag to force password change
);
GO

-- -----------------------------
-- Table: Instructor
-- -----------------------------
CREATE TABLE instructor (
                            id INT IDENTITY(1,1) PRIMARY KEY,  -- Primary key, auto-increment
                            first_name VARCHAR(255),            -- Instructor's first name
                            last_name VARCHAR(255),             -- Instructor's last name
                            user_name VARCHAR(255),             -- Username
                            pass VARCHAR(255),                  -- Password
                            email VARCHAR(255) NOT NULL,        -- Email
                            phone VARCHAR(15),                  -- Phone number
                            is_active BIT NOT NULL DEFAULT 0,   -- Active flag
                            is_admin BIT NOT NULL DEFAULT 0,    -- Admin flag
                            department_id INT NULL,             -- FK to departments.id (nullable)
                            forgot_password VARCHAR(255),       -- Forgot password token
                            reset_password_expires DATETIME,    -- Reset password expiration
                            must_change_password BIT            -- Flag to force password change
);
GO

-- -----------------------------
-- Table: Projects
-- -----------------------------
CREATE TABLE projects (
                          id INT IDENTITY(1,1) PRIMARY KEY,  -- Primary key, auto-increment
                          title VARCHAR(255),                 -- Project title
                          description TEXT,                   -- Project description
                          student_id1 INT NULL,               -- FK to students.id (nullable)
                          student_id2 INT NULL,               -- FK to students.id (nullable)
                          stage_count INT,                    -- Number of stages
                          status BIT NOT NULL DEFAULT 0,      -- Project status
                          link_to_github VARCHAR(255),        -- GitHub link
                          instructor_id INT NULL,             -- FK to instructor.id (nullable)
                          department_id INT NULL              -- FK to departments.id (nullable)
);
GO

-- -----------------------------
-- Table: Stages
-- -----------------------------
CREATE TABLE stages (
                        id INT IDENTITY(1,1) PRIMARY KEY,  -- Primary key, auto-increment
                        title VARCHAR(255),                 -- Stage title
                        department_id INT NULL,             -- FK to departments.id (nullable)
                        position INT NOT NULL DEFAULT 0     -- Stage position/order
);
GO

-- -----------------------------
-- Table: Comments
-- -----------------------------
CREATE TABLE comments (
                          id INT IDENTITY(1,1) PRIMARY KEY,  -- Primary key, auto-increment
                          title VARCHAR(255),                 -- Comment title
                          text TEXT,                          -- Comment text
                          project_id INT NULL,                -- FK to projects.id
                          section VARCHAR(255),               -- Section name
                          page INT NOT NULL,                  -- Page number
                          user_response TEXT,                 -- User response
                          is_done BIT,                        -- Completion flag
                          done_by_user INT                    -- User ID who marked done
);
GO

-- -----------------------------
-- Table: Technology_in_use
-- -----------------------------
CREATE TABLE technology_in_use (
                                   id INT IDENTITY(1,1) PRIMARY KEY,  -- Primary key, auto-increment
                                   title VARCHAR(255),                 -- Technology title
                                   language VARCHAR(255),              -- Programming language / tech
                                   department_id INT NULL              -- FK to departments.id
);
GO

-- -----------------------------
-- Table: Projects_Technologies (many-to-many)
-- -----------------------------
CREATE TABLE projects_technologies (
                                       project_id INT NOT NULL,            -- FK to projects.id
                                       technology_id INT NOT NULL,         -- FK to technology_in_use.id
                                       PRIMARY KEY (project_id, technology_id)
);
GO

-- -----------------------------
-- Table: Notifications
-- -----------------------------
CREATE TABLE notifications (
                               id INT IDENTITY(1,1) PRIMARY KEY,  -- Primary key, auto-increment
                               user_id INT NOT NULL,               -- User ID
                               role VARCHAR(50) NOT NULL,          -- Role: student/instructor/admin
                               title VARCHAR(255),                  -- Notification title
                               message TEXT,                        -- Notification message
                               type VARCHAR(50) NOT NULL,          -- Type: submission/comment/system/reminder/message
                               project_id INT NULL,                -- FK to projects.id
                               is_read BIT DEFAULT 0,              -- Read flag
                               created_at DATETIME DEFAULT GETDATE() -- Creation timestamp
);
GO

-- -----------------------------
-- Add foreign key constraints
-- -----------------------------
ALTER TABLE students
    ADD CONSTRAINT fk_student_department FOREIGN KEY (department_id) REFERENCES departments(id);

ALTER TABLE students
    ADD CONSTRAINT fk_student_project FOREIGN KEY (project_id) REFERENCES projects(id);

ALTER TABLE instructor
    ADD CONSTRAINT fk_instructor_department FOREIGN KEY (department_id) REFERENCES departments(id);

ALTER TABLE projects
    ADD CONSTRAINT fk_project_student1 FOREIGN KEY (student_id1) REFERENCES students(id);
ALTER TABLE projects
    ADD CONSTRAINT fk_project_student2 FOREIGN KEY (student_id2) REFERENCES students(id);
ALTER TABLE projects
    ADD CONSTRAINT fk_project_instructor FOREIGN KEY (instructor_id) REFERENCES instructor(id);
ALTER TABLE projects
    ADD CONSTRAINT fk_project_department FOREIGN KEY (department_id) REFERENCES departments(id);

ALTER TABLE stages
    ADD CONSTRAINT fk_stages_department FOREIGN KEY (department_id) REFERENCES departments(id);

ALTER TABLE comments
    ADD CONSTRAINT fk_comments_project FOREIGN KEY (project_id) REFERENCES projects(id);

ALTER TABLE technology_in_use
    ADD CONSTRAINT fk_technology_department FOREIGN KEY (department_id) REFERENCES departments(id);

ALTER TABLE projects_technologies
    ADD CONSTRAINT fk_projects_tech_project FOREIGN KEY (project_id) REFERENCES projects(id);
ALTER TABLE projects_technologies
    ADD CONSTRAINT fk_projects_tech_technology FOREIGN KEY (technology_id) REFERENCES technology_in_use(id);

ALTER TABLE notifications
    ADD CONSTRAINT fk_notifications_project FOREIGN KEY (project_id) REFERENCES projects(id);
GO
