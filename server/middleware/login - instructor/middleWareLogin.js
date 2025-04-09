const md5 = require("md5");
const jwt = require('jsonwebtoken');
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
        res.message = "Too many requests. Try again later.";
        return next();
    }

    const uname = req.body.userName;
    const password = EncWithSalt(req.body.password);
    res.loggedEn = false;

    const Query = `SELECT * FROM \`teachers\` WHERE user_name = ? AND pass = ?`;
    const promisePool = db_pool.promise();

    try {
        const [rows] = await promisePool.query(Query, [uname, password]);

        if (rows.length > 0) {
            const token = jwt.sign({ userName: uname }, jwtSecret, { expiresIn: '1d' });

            res.cookie('instructor', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 86400000,
                sameSite: 'Strict',
            });

            res.loggedEn = true;
            req.user = rows[0];
        } else {
            res.message = "Invalid credentials";
        }

        return next();
    } catch (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
    }
}

module.exports = {
    check_login,
    EncWithSalt
};
