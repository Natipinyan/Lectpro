const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();


const { db_pool } = require('./LoginDB');
const PORT = 5000;


app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


db_pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the database!');
        connection.release();
    }
});

const studentsRouter = require("./routers/users/students");
app.use("/students", studentsRouter);

const instructorRouter = require("./routers/users/instructor");
app.use("/instructor", instructorRouter);

const uploadRouter = require("./routers/tablesDB/upload");
app.use("/upload", uploadRouter);

const projectsRouter = require("./routers/tablesDB/projects");
app.use("/projects", projectsRouter);

const authRouterStd = require("./routers/login/login - students/authStudents");
app.use("/apiStudent", authRouterStd);

const authRouterIns= require("./routers/login/login - instructor/authInstructor");
app.use("/apiInstructor", authRouterIns);


const techRouter = require("./routers/tablesDB/technology");
app.use("/technology", techRouter);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});