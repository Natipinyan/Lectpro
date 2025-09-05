const jwt = require("jsonwebtoken");
const md5 = require("md5");
const { RateLimiterMemory } = require("rate-limiter-flexible");

const Salt = process.env.SALT;
const jwtSecret = process.env.JWT_SECRET_KEY;

const opts = {
    points: 6,
    duration: 3 * 60,
};

const rateLimiter = new RateLimiterMemory(opts);

function EncWithSalt(str) {
    return md5(Salt + str);
}

async function check_login(req, res, next) {
    let points = -3;

    try {
        const rateLimiterRes = await rateLimiter.consume(req.connection.remoteAddress, 1);
        points = rateLimiterRes.remainingPoints;
    } catch {
        points = 0;
    }

    if (points <= 0) {
        res.statusCodeToSend = 429;
        res.responseData = {
            loggedIn: false,
            message: "המערכת זיהתה ניסיונות מרובים, אנא המתן מספר דקות",
        };
        return next();
    }

    const uname = req.body.userName;
    const password = EncWithSalt(req.body.password);

    const Query = `SELECT * FROM instructor WHERE user_name = ?`;
    const promisePool = db_pool.promise();

    try {
        const [rows] = await promisePool.query(Query, [uname]);

        if (rows.length === 0) {
            res.statusCodeToSend = 401;
            res.responseData = {
                loggedIn: false,
                message: "משתמש לא קיים",
            };
            return next();
        }

        const userRow = rows[0];

        if (!userRow.is_active) {
            res.statusCodeToSend = 403;
            res.responseData = {
                loggedIn: false,
                message: "המשתמש לא פעיל במערכת",
            };
            return next();
        }

        if (userRow.pass !== password) {
            res.statusCodeToSend = 401;
            res.responseData = {
                loggedIn: false,
                message: "שגיאה בסיסמה, אנא נסה שנית",
            };
            return next();
        }

        const token = jwt.sign(
            {
                userName: userRow.user_name,
                id: userRow.id,
                Email: userRow.email,
                department_id: userRow.department_id
            },
            jwtSecret,
            { expiresIn: "1d" }
        );

        res.cookie("instructors", token, {
            httpOnly: true,
            secure: false, // change to true in production
            maxAge: 86400000,
            sameSite: "Lax",
        });

        res.statusCodeToSend = 200;
        res.responseData = {
            loggedIn: true,
            message: "התחברת בהצלחה",
            mustChangePassword: userRow.must_change_password === 1,
            user: {
                id: userRow.id,
                userName: userRow.user_name,
                department_id: userRow.department_id
            },
        };

        return next();
    } catch (err) {
        console.error("Database error:", err);
        res.statusCodeToSend = 500;
        res.responseData = {
            loggedIn: false,
            message: "שגיאה במסד הנתונים",
            error: err.message,
        };
        return next();
    }
}

function authenticateToken(req, res, next) {
    const token = req.cookies.instructors;
    if (!token) {
        return res.status(401).json({ message: "נדרש להתחבר למערכת" });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = {
            id: decoded.id,
            userName: decoded.userName,
            email: decoded.Email,
            department_id: decoded.department_id
        };
        next();
    } catch (err) {
        console.error("Token verification failed:", err);
        return res.status(403).json({ message: "טוקן לא תקין או שפג תוקפו" });
    }
}

function externalAuthenticate(req, res, next) {
    const token = req.cookies.instructors;

    if (!token) {
        return res.status(200).json({ success: true, data: { isAuthenticated: false } });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = {
            id: decoded.id,
            userName: decoded.userName,
            email: decoded.Email,
            department_id: decoded.department_id
        };
        next();
    } catch (err) {
        console.error("Token verification failed:", err);
        return res.status(200).json({ success: true, data: { isAuthenticated: false } });
    }
}

function logout(req, res) {
    res.clearCookie("instructors", {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
    });

    res.status(200).json({
        loggedOut: true,
        message: "התנתקת בהצלחה",
    });
}


// Middleware to check if the user is an admin
async function checkAdmin(req, res, next) {
    const token = req.cookies.instructors;
    if (!token) {
        res.isAdmin = false;
        return next();
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        const promisePool = db_pool.promise();
        const [rows] = await promisePool.query(
            `SELECT is_admin FROM instructor WHERE id = ?`,
            [decoded.id]
        );

        res.isAdmin = rows.length > 0 && rows[0].is_admin === 1;

        req.user = {
            id: decoded.id,
            userName: decoded.userName,
            email: decoded.Email,
            department_id: decoded.department_id
        };
        return next();
    } catch (err) {
        console.error("Token verification failed:", err);
        res.isAdmin = false;
        return next();
    }
}

//use on server routes that require admin access
async function ensureAdmin(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "לא נמצא מזהה משתמש" });
        }

        const promisePool = db_pool.promise();
        const [rows] = await promisePool.query(
            `SELECT is_admin FROM instructor WHERE id = ?`,
            [userId]
        );

        if (!rows.length || rows[0].is_admin !== 1) {
            return res.status(403).json({ success: false, message: "אין הרשאות מנהל" });
        }

        next();
    } catch (err) {
        console.error("שגיאה בבדיקת אדמין:", err);
        res.status(500).json({ success: false, message: "שגיאה בשרת" });
    }
}

// Middleware to check if the user is the instructor of a specific project
async function checkProjectInstructor(req, res, next) {
    const { projectId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        res.checkProjectInstructor = { success: false, message: "משתמש לא מזוהה", isProjectInstructor: false };
        return next();
    }

    try {
        const promisePool = db_pool.promise();

        const [projects] = await promisePool.query(
            `SELECT instructor_id, department_id FROM projects WHERE id = ?`,
            [projectId]
        );

        if (projects.length === 0) {
            res.checkProjectInstructor = { success: false, message: "פרויקט לא נמצא", isProjectInstructor: false };
            return next();
        }

        const project = projects[0];

        if (project.instructor_id === userId) {
            res.checkProjectInstructor = { success: true, isProjectInstructor: true };
            return next();
        }

        const [instructorRows] = await promisePool.query(
            `SELECT is_admin FROM instructor WHERE id = ? AND department_id = ?`,
            [userId, project.department_id]
        );

        const isAdminOnly = instructorRows.length > 0 && instructorRows[0].is_admin === 1;

        res.checkProjectInstructor = { success: true, isProjectInstructor: false, isAdminOnly };
        next();

    } catch (err) {
        console.error("Error checking project instructor:", err);
        res.checkProjectInstructor = { success: false, message: "שגיאה בבדיקת הרשאות", isProjectInstructor: false };
        next();
    }
}


module.exports = {
    check_login,
    EncWithSalt,
    authenticateToken,
    externalAuthenticate,
    logout,
    checkAdmin,
    ensureAdmin,
    checkProjectInstructor,
};
