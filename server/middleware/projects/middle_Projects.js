const path = require('path');
const fs = require('fs');

// =====================
// RESTful Middleware - Fully RESTful Implementation
// =====================

const addProject = (req, res) => {
    const { projectName, projectDesc, linkToGithub, selectedTechnologies } = req.body;
    const studentId = req.user.id;

    if (
        !projectName ||
        !projectDesc ||
        !studentId ||
        !selectedTechnologies ||
        !Array.isArray(selectedTechnologies) ||
        selectedTechnologies.length === 0 ||
        selectedTechnologies.some(tech => !tech.id)
    ) {
        return res.status(400).json({ message: "Missing project details, technologies, or user ID" });
    }

    if (projectName.length > 25) {
        return res.status(400).json({ message: "Project name cannot exceed 25 characters" });
    }

    if (linkToGithub && !/^https:\/\/github\.com\/.+$/.test(linkToGithub)) {
        return res.status(400).json({ message: "Please provide a valid GitHub link" });
    }

    const queryCheckDuplicate = `SELECT id FROM projects WHERE title = ?`;
    db_pool.query(queryCheckDuplicate, [projectName], (err, results) => {
        if (err) {
            console.error("DB Error (check duplicate):", err);
            return res.status(500).json({ message: "Error checking project name" });
        }

        if (results.length > 0) {
            return res.status(409).json({ message: "A project with this name already exists. Please choose another name." });
        }

        const queryProject = `INSERT INTO projects (title, description, student_id1, link_to_github) VALUES (?, ?, ?, ?)`;
        db_pool.query(queryProject, [projectName, projectDesc, studentId, linkToGithub || null], (err, result) => {
            if (err) {
                console.error("DB Error (projects):", err);
                return res.status(500).json({ message: "Error adding project" });
            }

            const projectId = result.insertId;

            const queryUpdateStudent = `UPDATE students SET project_id = ? WHERE id = ?`;
            db_pool.query(queryUpdateStudent, [projectId, studentId], (err2) => {
                if (err2) {
                    console.error("DB Error (students update):", err2);
                    return res.status(500).json({ message: "Error updating student" });
                }

                const technologyPromises = selectedTechnologies.map(({ id }) => {
                    const queryTechnology = `INSERT INTO projects_technologies (project_id, technology_id) VALUES (?, ?)`;
                    return new Promise((resolve, reject) => {
                        db_pool.query(queryTechnology, [projectId, id], (err3) => {
                            if (err3) {
                                console.error(`DB Error (projects_technologies) for technology ID ${id}:`, err3);
                                return reject({ message: `Error adding technology ID ${id}: ${err3.message}` });
                            }
                            resolve();
                        });
                    });
                });

                Promise.all(technologyPromises)
                    .then(() => {
                        // Return the created project object
                        const getProjectQuery = `SELECT * FROM projects WHERE id = ?`;
                        db_pool.query(getProjectQuery, [projectId], (err, rows) => {
                            if (err || !rows || rows.length === 0) {
                                return res.status(201).json({ message: "Project created, but could not fetch project details" });
                            }
                            return res.status(201).json(rows[0]);
                        });
                    })
                    .catch(error => {
                        console.error("Error adding technologies:", error);
                        return res.status(500).json(error);
                    });
            });
        });
    });
};

const getProjects = (req, res) => {
    const studentId = req.user.id;
    const q = `SELECT * FROM \`projects\` WHERE student_id1 = ?;`;
    db_pool.query(q, [studentId], function (err, rows) {
        if (err) {
            return res.status(500).json({ message: "Error fetching projects" });
        }
        return res.status(200).json(rows);
    });
};

const getOneProject = (req, res) => {
    const studentId = req.user.id;
    const projectId = req.params.projectId;
    const q = `SELECT * FROM projects WHERE id = ? AND student_id1 = ?;`;
    db_pool.query(q, [projectId, studentId], function (err, rows) {
        if (err) {
            console.error("Error fetching project:", err);
            return res.status(500).json({ message: "Error fetching project" });
        }
        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: "Project not found" });
        }
        return res.status(200).json(rows[0]);
    });
};

const getProjectTechnologies = (req, res) => {
    const { projectId } = req.params;
    const q = `SELECT t.id, t.title, t.language FROM projects_technologies pt JOIN technology_in_use t ON pt.technology_id = t.id WHERE pt.project_id = ?`;
    db_pool.query(q, [projectId], (err, rows) => {
        if (err) {
            console.error("Error fetching project technologies:", err);
            return res.status(500).json({ message: 'Error fetching project technologies' });
        }
        return res.status(200).json(rows);
    });
};

const editProject = (req, res) => {
    const { projectName, projectDesc, linkToGithub, selectedTechnologies } = req.body;
    const projectId = req.params.projectId;
    const studentId = req.user.id;

    if (
        !projectId ||
        !projectName ||
        !projectDesc ||
        !studentId ||
        !selectedTechnologies ||
        !Array.isArray(selectedTechnologies) ||
        selectedTechnologies.length === 0 ||
        selectedTechnologies.some(tech => !tech.id)
    ) {
        return res.status(400).json({ message: "Missing project details, technologies, user ID, or project ID" });
    }

    if (linkToGithub && !/^https:\/\/github\.com\/.+$/.test(linkToGithub)) {
        return res.status(400).json({ message: "Please provide a valid GitHub link" });
    }

    const queryCheckProject = `SELECT id FROM projects WHERE id = ? AND student_id1 = ?`;
    db_pool.query(queryCheckProject, [projectId, studentId], (err, results) => {
        if (err) {
            console.error("DB Error (check project):", err);
            return res.status(500).json({ message: "Error checking project" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Project not found or you do not have permission to edit it" });
        }

        const queryCheckDuplicate = `SELECT id FROM projects WHERE title = ? AND id != ?`;
        db_pool.query(queryCheckDuplicate, [projectName, projectId], (err, results) => {
            if (err) {
                console.error("DB Error (check duplicate):", err);
                return res.status(500).json({ message: "Error checking project name" });
            }

            if (results.length > 0) {
                return res.status(409).json({ message: "A project with this name already exists. Please choose another name." });
            }

            const queryUpdateProject = `UPDATE projects SET title = ?, description = ?, link_to_github = ? WHERE id = ?`;
            db_pool.query(queryUpdateProject, [projectName, projectDesc, linkToGithub || null, projectId], (err) => {
                if (err) {
                    console.error("DB Error (update project):", err);
                    return res.status(500).json({ message: "Error updating project details" });
                }

                const queryDeleteTechnologies = `DELETE FROM projects_technologies WHERE project_id = ?`;
                db_pool.query(queryDeleteTechnologies, [projectId], (err) => {
                    if (err) {
                        console.error("DB Error (delete technologies):", err);
                        return res.status(500).json({ message: "Error deleting existing technologies" });
                    }

                    const technologyPromises = selectedTechnologies.map(({ id }) => {
                        const queryTechnology = `INSERT INTO projects_technologies (project_id, technology_id) VALUES (?, ?)`;
                        return new Promise((resolve, reject) => {
                            db_pool.query(queryTechnology, [projectId, id], (err3) => {
                                if (err3) {
                                    console.error(`DB Error (projects_technologies) for technology ID ${id}:`, err3);
                                    return reject({ message: `Error adding technology ID ${id}: ${err3.message}` });
                                }
                                resolve();
                            });
                        });
                    });

                    Promise.all(technologyPromises)
                        .then(() => {
                            // Return the updated project object
                            const getProjectQuery = `SELECT * FROM projects WHERE id = ?`;
                            db_pool.query(getProjectQuery, [projectId], (err, rows) => {
                                if (err || !rows || rows.length === 0) {
                                    return res.status(200).json({ message: "Project updated, but could not fetch project details" });
                                }
                                return res.status(200).json(rows[0]);
                            });
                        })
                        .catch(error => {
                            console.error("Error adding technologies:", error);
                            return res.status(500).json(error);
                        });
                });
            });
        });
    });
};

const deleteProject = (req, res) => {
    const projectId = req.params.projectId;
    const studentId = req.user.id;

    if (!projectId || isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid projectId" });
    }

    const queryCheckProject = `SELECT id FROM projects WHERE id = ? AND student_id1 = ?`;
    db_pool.query(queryCheckProject, [projectId, studentId], (err, results) => {
        if (err) {
            console.error("DB Error (check project):", err);
            return res.status(500).json({ message: "Error checking project" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Project not found or you do not have permission to delete it" });
        }

        const queryUpdateStudent = `UPDATE students SET project_id = NULL WHERE id = ? AND project_id = ?`;
        db_pool.query(queryUpdateStudent, [studentId, projectId], (err) => {
            if (err) {
                console.error("DB Error (update student):", err);
                return res.status(500).json({ message: "Error updating student details" });
            }

            const queryDeleteTechnologies = `DELETE FROM projects_technologies WHERE project_id = ?`;
            db_pool.query(queryDeleteTechnologies, [projectId], (err) => {
                if (err) {
                    console.error("DB Error (delete technologies):", err);
                    return res.status(500).json({ message: "Error deleting project technologies" });
                }

                const queryDeleteProject = `DELETE FROM projects WHERE id = ?`;
                db_pool.query(queryDeleteProject, [projectId], (err) => {
                    if (err) {
                        console.error("DB Error (delete project):", err);
                        return res.status(500).json({ message: "Error deleting project" });
                    }
                    // Success: return 204 No Content
                    return res.status(204).send();
                });
            });
        });
    });
};

const getProjectFile = (req, res) => {
    const projectId = req.params.projectId;
    if (!projectId || isNaN(projectId)) {
        return res.status(400).json({ message: 'Invalid projectId' });
    }
    const fileName = `${projectId}.pdf`;
    const filePath = path.join(__dirname, '..', '..', 'filesApp', fileName);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: `PDF file not found for projectId: ${fileName}` });
    }
    return res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            return res.status(500).json({ message: 'Error sending file' });
        }
    });
};

// =====================
// Export
// =====================

module.exports = {
    addProject,
    getProjects,
    getOneProject,
    getProjectTechnologies,
    getProjectFile,
    editProject,
    deleteProject,
};