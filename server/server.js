const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();

const { pool } = require('./LoginDB');
const PORT = 5000;

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
}));


db_pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the database!');
        connection.release();
    }
});


const students_rtr =require('./routers/students');
app.use('/students',students_rtr);

const instructor_rtr =require('./routers/instructor');
app.use('/instructor',instructor_rtr);

const upload_rtr =require('./routers/upload');
app.use('/upload',upload_rtr);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
