const mysql = require('mysql2');
const params = require("./loginParams");
const HOST     =params.HOST     ;
const USER     =params.USER     ;
const PASSWORD =params.PASSWORD ;
const LoginDb =params.DATABASE ;


let pool = mysql.createPool({
    host:		HOST		,
    user:		USER		,
    password:	PASSWORD	,
    database:	LoginDb	,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
})

module.exports = {
    pool:pool
};