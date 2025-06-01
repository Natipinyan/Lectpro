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
    } catch (rateLimiterRes) {
        points = 0;
    }

    if (points <= 0) {
        res.loggedEn = false;
        res.message = "המערכת זיהתה ניסיונות מרובים, אנא המתן מספר דקות";
        return next();
    }

    let uname = req.body.userName;
    let password = EncWithSalt(req.body.password);
    res.loggedEn = false;

    const Query = `SELECT * FROM students WHERE user_name = ?`;
    const promisePool = db_pool.promise();

    try {
        const [rows] = await promisePool.query(Query, [uname]);

        if (rows.length === 0) {
            res.message = "משתמש לא קיים";
            return next();
        }

        if (rows[0].pass !== password) {
            res.message = "שגיאה בסיסמה, אנא נסה שנית";
            return next();
        }

        const token = jwt.sign(
            { userName: uname, id: rows[0].id, Email: rows[0].email },
            jwtSecret,
            { expiresIn: "1d" }
        );

        res.cookie("students", token, {
            httpOnly: true,
            secure: false, // change to true in production
            maxAge: 86400000,
            sameSite: "Lax",
        });

        res.loggedEn = true;
        req.user = rows[0];

        res.mustChangePassword = rows[0].must_change_password === 1;

        return next();
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error", error: err.message });
    }
}

function authenticateToken(req, res, next) {
    const token = req.cookies.students;
    //console.log("Received token in check-auth:", token);
    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = { id: decoded.id, userName: decoded.userName, email: decoded.Email };
        next();
    } catch (err) {
        console.error("Token verification failed:", err);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}

module.exports = {
    check_login,
    EncWithSalt,
    authenticateToken,
};