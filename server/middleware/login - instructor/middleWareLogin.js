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
        res.message = "בוצעו יותר מדי ניסיונות. נסה שוב מאוחר יותר.";
        return next();
    }

    let uname = req.body.userName;
    let password = EncWithSalt(req.body.password);
    res.loggedEn = false;

    const Query = `SELECT * FROM teachers WHERE user_name = ? AND pass = ?`;
    const promisePool = db_pool.promise();

    try {
        const [rows] = await promisePool.query(Query, [uname, password]);

        if (rows.length > 0) {
            const token = jwt.sign(
                { userName: uname, id: rows[0].id },
                jwtSecret,
                { expiresIn: "1d" }
            );

            res.cookie("instructors", token, {
                httpOnly: true,
                secure: false, // change to true in production
                maxAge: 86400000,
                sameSite: "Lax",
            });

            res.loggedEn = true;
            req.user = rows[0];
            //console.log("Cookie set:", token);
        } else {
            res.message = "שם משתמש או סיסמה שגויים";
        }

        return next();
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "שגיאה במסד הנתונים", error: err.message });
    }
}

function authenticateToken(req, res, next) {
    const token = req.cookies.instructors;
    console.log("Received token in check-auth:", token);

    if (!token) {
        return res.status(401).json({ message: "נדרש להתחבר למערכת" });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = { id: decoded.id, userName: decoded.userName };
        next();
    } catch (err) {
        console.error("Token verification failed:", err);
        return res.status(403).json({ message: "טוקן לא תקין או שפג תוקפו" });
    }
}

module.exports = {
    check_login,
    EncWithSalt,
    authenticateToken,
};