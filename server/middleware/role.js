const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET_KEY;

//role and access control middleware
async function getRole(req, res, next) {
    const cookieNames = Object.keys(req.cookies);
    const type = cookieNames[0];
    const token = req.cookies[type];

    if (!token) {
        return res.status(401).json({ message: "נדרש להתחבר למערכת" });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);

        req.user = {
            id: decoded.id,
            userName: decoded.userName,
            email: decoded.Email,
            department_id: decoded.department_id,
            role: null,
            isAdmin: false
        };

        if (type === "students") {
            req.user.role = "student";
        } else if (type === "instructors") {
            const promisePool = db_pool.promise();
            const [rows] = await promisePool.query(
                `SELECT is_admin FROM instructor WHERE id = ?`,
                [decoded.id]
            );

            if (rows.length > 0) {
                req.user.role = "instructor";
                req.user.isAdmin = rows[0].is_admin === 1;
            } else {
                return res.status(403).json({ message: "מרצה לא נמצא במערכת" });
            }
        } else {
            return res.status(403).json({ message: "סוג משתמש לא מזוהה" });
        }

        next();
    } catch (err) {
        return res.status(403).json({ message: "טוקן לא תקין או שפג תוקפו" });
    }
}

//-------------projects access control functions------------------//

//access control function for projects
async function checkUserProjectAccess(userId, type, projectId) {
    const promisePool = db_pool.promise();

    if (type === "student") {
        const [rows] = await promisePool.query(
            `SELECT id FROM projects WHERE id = ? AND (student_id1 = ? OR student_id2 = ?)`,
            [projectId, userId, userId]
        );

        return {
            role: "student",
            hasAccess: rows.length > 0
        };

    } else if (type === "instructor") {
        const [instructorRows] = await promisePool.query(
            `SELECT is_admin, department_id FROM instructor WHERE id = ?`,
            [userId]
        );

        if (instructorRows.length === 0) {
            return { role: "null", hasAccess: false, isAdmin: false };
        }

        const isAdmin = instructorRows[0].is_admin === 1;
        const departmentId = instructorRows[0].department_id;

        if (isAdmin) {
            const [rows] = await promisePool.query(
                `SELECT id FROM projects WHERE id = ? AND department_id = ?`,
                [projectId, departmentId]
            );
            return { role: "instructor", hasAccess: rows.length > 0, isAdmin, departmentId };
        } else {
            const [rows] = await promisePool.query(
                `SELECT id FROM projects WHERE id = ? AND instructor_id = ?`,
                [projectId, userId]
            );
            return { role: "instructor", hasAccess: rows.length > 0, isAdmin, departmentId };
        }
    } else {
        return { role: null, hasAccess: false };
    }
}

//-------------projects access control functions------------------//

//-------------comments access control functions------------------//

//access control function for comments
async function checkUserCommentAccess(userId, type, commentId) {
    const promisePool = db_pool.promise();

    if (type === "student") {
        const [rows] = await promisePool.query(
            `SELECT c.id
             FROM comments c
             JOIN projects p ON c.project_id = p.id
             WHERE c.id = ? AND (p.student_id1 = ? OR p.student_id2 = ?)`,
            [commentId, userId, userId]
        );

        return {
            role: "student",
            hasAccess: rows.length > 0
        };

    } else if (type === "instructor") {
        const [instructorRows] = await promisePool.query(
            `SELECT is_admin, department_id FROM instructor WHERE id = ?`,
            [userId]
        );

        if (instructorRows.length === 0) {
            return { role: null, hasAccess: false, isAdmin: false };
        }

        const isAdmin = instructorRows[0].is_admin === 1;
        const departmentId = instructorRows[0].department_id;

        if (isAdmin) {
            const [rows] = await promisePool.query(
                `SELECT c.id
                 FROM comments c
                 JOIN projects p ON c.project_id = p.id
                 WHERE c.id = ? AND p.department_id = ?`,
                [commentId, departmentId]
            );
            return { role: "instructor", hasAccess: rows.length > 0, isAdmin, departmentId };
        } else {
            const [rows] = await promisePool.query(
                `SELECT c.id
                 FROM comments c
                 JOIN projects p ON c.project_id = p.id
                 WHERE c.id = ? AND p.instructor_id = ?`,
                [commentId, userId]
            );
            return { role: "instructor", hasAccess: rows.length > 0, isAdmin, departmentId };
        }
    } else {
        return { role: null, hasAccess: false };
    }
}

// Access control for performing actions on comments (add, update, delete)
async function checkUserCommentActionAccess(userId, type, { commentId = null, projectId = null } = {}) {
    const promisePool = db_pool.promise();

    if (type !== "instructor") return { role: type, hasAccess: false };

    let rows = [];
    if (commentId) {
        [rows] = await promisePool.query(
            `SELECT c.id
             FROM comments c
             JOIN projects p ON c.project_id = p.id
             WHERE c.id = ? AND p.instructor_id = ?`,
            [commentId, userId]
        );
    } else if (projectId) {
        [rows] = await promisePool.query(
            `SELECT id
             FROM projects
             WHERE id = ? AND instructor_id = ?`,
            [projectId, userId]
        );
    }

    return { role: "instructor", hasAccess: rows.length > 0 };
}

//-------------comments access control functions------------------//

async function checkUserStageAccess(userId, type, departmentId) {
    const promisePool = db_pool.promise();

    if (type === "student") {
        const [rows] = await promisePool.query(
            `SELECT id 
             FROM students 
             WHERE id = ? AND department_id = ?`,
            [userId, departmentId]
        );

        return {
            role: "student",
            hasAccess: rows.length > 0,
            isAdmin: false
        };

    } else if (type === "instructor") {
        const [instructorRows] = await promisePool.query(
            `SELECT is_admin, department_id 
             FROM instructor 
             WHERE id = ?`,
            [userId]
        );

        if (instructorRows.length === 0) {
            return { role: null, hasAccess: false, isAdmin: false };
        }

        const isAdmin = instructorRows[0].is_admin === 1;
        const instructorDepartmentId = instructorRows[0].department_id;

        if (isAdmin) {
            // אם האדמין הוא של המגמה הנתונה
            const hasAccess = instructorDepartmentId === departmentId;
            return { role: "admin", hasAccess, isAdmin };
        } else {
            // מרצה רגיל – רק אם הוא שייך למגמה הזו
            const hasAccess = instructorDepartmentId === departmentId;
            return { role: "instructor", hasAccess, isAdmin };
        }
    } else {
        return { role: null, hasAccess: false, isAdmin: false };
    }
}

async function checkUserStageActionAccess(userId, type, departmentId) {
    const promisePool = db_pool.promise();

    const [rows] = await promisePool.query(
        `SELECT is_admin FROM instructor WHERE id = ? AND department_id = ?`,
        [userId, departmentId]
    );

    const isAdmin = rows.length > 0 && rows[0].is_admin === 1;

    return {
        role: type,
        hasAccess: isAdmin,
        isAdmin: isAdmin,
        departmentId
    };
}

async function checkUserStageUpdateAccess(userId, type, departmentId, { stageId = null, projectId = null } = {}) {
    const promisePool = db_pool.promise();
    let rows = [];

    if (type !== "instructor") return { role: type, hasAccess: false };

    if (stageId) {
        [rows] = await promisePool.query(
            `SELECT s.id
             FROM stages s
             JOIN projects p ON s.project_id = p.id
             WHERE s.id = ? AND p.instructor_id = ?`,
            [stageId, userId]
        );
    } else if (projectId) {
        [rows] = await promisePool.query(
            `SELECT id
             FROM projects
             WHERE id = ? AND instructor_id = ?`,
            [projectId, userId]
        );
    }

    return { role: "instructor", hasAccess: rows.length > 0 };
}






module.exports = {
    getRole,
    checkUserProjectAccess,
    checkUserCommentAccess,
    checkUserCommentActionAccess,
    checkUserStageAccess,
    checkUserStageActionAccess,
    checkUserStageUpdateAccess

};
