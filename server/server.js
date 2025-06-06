const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const { db_pool } = require('./LoginDB');
const { sendEmailFromServer } = require('./middleware/Email/Email');
global.sendMailServer = sendEmailFromServer;

const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/files', express.static(path.join(__dirname, 'filesApp')));
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

db_pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the database!');
        connection.release();
    }
});

const studentsRouter = require("./routers/users/students");
const instructorRouter = require("./routers/users/instructor");
const uploadRouter = require("./routers/tablesDB/upload");
const projectsRouter = require("./routers/tablesDB/projects");
const authRouterStd = require("./routers/login/login - students/authStudents");
const authRouterIns = require("./routers/login/login - instructor/authInstructor");
const techRouter = require("./routers/tablesDB/technology");
const EmailRouter = require("./routers/email/email");

app.use("/students", studentsRouter);
app.use("/instructor", instructorRouter);
app.use("/upload", uploadRouter);
app.use("/projects", projectsRouter);
app.use("/apiStudent", authRouterStd);
app.use("/apiInstructor", authRouterIns);
app.use("/technology", techRouter);
app.use("/Email", EmailRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});