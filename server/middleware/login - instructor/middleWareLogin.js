const md5 = require("md5");
const Salt = process.env.SALT;
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET_KEY;
const { RateLimiterMemory } = require("rate-limiter-flexible");
const opts = {
    points: 6, // Number of requests
    duration: 3 * 60, // in seconds
};

const rateLimiter = new RateLimiterMemory(opts);

function EncWithSalt(str) {
    return md5(Salt + str);
}

async function check_login(req, res, next) {
    let points = -3;

    await rateLimiter.consume(req.connection.remoteAddress, 1)
        .then((rateLimiterRes) => {
            points = rateLimiterRes.remainingPoints;
        })
        .catch((rateLimiterRes) => {
            points = 0;
        });

    if (points > 0) {
        await CheckUser(req, res);
        if (res.loggedEn) {
            const token = jwt.sign({ userName: req.body.userName }, jwtSecret, { expiresIn: '1d' });

            res.cookie('instructor', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 86400000,
                sameSite: 'Strict',
            });


            res.json({
                loggedIn: true,
                token: token
            });
        } else {
            res.json({
                loggedIn: false,
                message: 'Invalid credentials'
            });
        }
    } else {
        res.json({
            loggedIn: false,
            message: 'Too many requests. Try again later.'
        });
    }
}

async function CheckUser(req, res) {
    let uname = req.body.userName;
    let password = EncWithSalt(req.body.password);
    console.log(`uname: ${uname}, password: ${password}`);

    res.loggedEn = false;

    const Query = `SELECT * FROM \`teachers\` WHERE user_name='${uname}' AND pass='${password}'`;
    console.log(Query);

    const promisePool = db_pool.promise();
    let rows = [];
    try {
        [rows] = await promisePool.query(Query);
    } catch (err) {
        return res.status(500).json({ message: err });
    }
    if (rows.length > 0) {
        res.loggedEn = true;
        req.user = rows[0];
    }
}

module.exports = {
    check_login: check_login,
    EncWithSalt: EncWithSalt
};