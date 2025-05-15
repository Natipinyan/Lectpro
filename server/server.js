const express = require('express');
const app = express();
const cors = require('cors');
const session = require("express-session");
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { db_pool } = require('./LoginDB');
const PORT = 5000;


app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
}));

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

app.use('/students', require('./routers/students'));
app.use('/instructor', require('./routers/instructor'));
app.use('/upload', require('./routers/upload'));
app.use('/projects', require('./routers/projects'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
