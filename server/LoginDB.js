const mysql = require('mysql2');


global.db_pool = mysql.createPool({
    host:		process.env.HOST	,
    user:		process.env.USER	,
    password:	process.env.PASSWORD	,
    database:	process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
})

module.exports = {
    db_pool:db_pool
};