async function getInstructorDashboard(req, res, next) {
    const user = req.user;
    if (!user) {
        res.getStatus = 401;
        res.getMessage = "נדרש להתחבר";
        return next();
    }

    try {
        // --- Fetch projects based on role ---
        let projectsQuery = `SELECT p.id, p.title, p.stage_count, p.department_id
                             FROM projects p`;
        let queryParams = [];

        if (!user.isAdmin) {
            // Instructor: only their projects
            projectsQuery += ` WHERE p.instructor_id = ?`;
            queryParams.push(user.id);
        } else {
            // Admin: all projects in their department
            projectsQuery += ` WHERE p.department_id = ?`;
            queryParams.push(user.department_id);
        }

        const [projects] = await db_pool.promise().query(projectsQuery, queryParams);
        const projectIds = projects.map(p => p.id);

        // --- Fetch total stages per department ---
        const deptIds = [...new Set(projects.map(p => p.department_id))];
        let totalStagesMap = {};
        if (deptIds.length > 0) {
            const [stagesRows] = await db_pool.promise().query(
                `SELECT department_id, COUNT(*) AS total_stages
                 FROM stages
                 WHERE department_id IN (?)
                 GROUP BY department_id`,
                [deptIds]
            );
            stagesRows.forEach(row => {
                totalStagesMap[row.department_id] = row.total_stages;
            });
        }

        // --- Build project progress ---
        const projectsProgress = projects.map(p => {
            const total = totalStagesMap[p.department_id] || 0;
            const done = Math.min(p.stage_count || 0, total);
            return {
                id: p.id,
                title: p.title,
                total_stages: total,
                done_stages: done
            };
        });

        // --- Calculate projects status ---
        const finished = projectsProgress.filter(p => p.done_stages >= p.total_stages).length;
        const in_progress = projectsProgress.filter(p => p.done_stages < p.total_stages).length;

        // --- Comments summary ---
        let commentsSummary = { total_comments: 0, done_comments: 0 };
        if (projectIds.length > 0) {
            const [commentsRows] = await db_pool.promise().query(
                `SELECT COUNT(*) AS total_comments,
                        SUM(CASE WHEN is_done = 1 THEN 1 ELSE 0 END) AS done_comments
                 FROM comments
                 WHERE project_id IN (?)`,
                [projectIds]
            );
            commentsSummary = commentsRows[0] || commentsSummary;
        }

        // --- Technologies usage ---
        const [techRows] = await db_pool.promise().query(
            `SELECT ti.language AS tech_language, COUNT(DISTINCT pt.project_id) AS project_count
             FROM technology_in_use ti
                      JOIN projects_technologies pt ON ti.id = pt.technology_id
                      JOIN projects p ON p.id = pt.project_id
                 ${!user.isAdmin ? `WHERE p.instructor_id = ?` : `WHERE p.department_id = ?`}
             GROUP BY ti.language`,
            [!user.isAdmin ? user.id : user.department_id]
        );

        res.data = {
            projectCount: { project_count: projects.length },
            projectsProgress,
            projectsStatus: { finished: finished.toString(), in_progress: in_progress.toString() },
            commentsSummary,
            technologiesUsage: techRows
        };
        res.getStatus = 200;
        res.getMessage = "Dashboard data fetched successfully";
        next();

    } catch (err) {
        console.error("Error fetching dashboard:", err);
        res.getStatus = 500;
        res.getMessage = "שגיאה בשליפת הנתונים לדשבורד";
        next();
    }
}

module.exports = { getInstructorDashboard };
