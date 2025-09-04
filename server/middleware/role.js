const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET_KEY;

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
module.exports = { getRole };
