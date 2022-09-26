const express = require('express');
const dotenv = require('dotenv');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();
dotenv.config();

const port = process.env.PORT;

// configuring the database
const dbConfig = require('./db/dbConfig');

// src routes
const userRoutes = require('./src/routes/user.route');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));

app.use('/users', userRoutes);


app.get('/', (req, res) => {
    res.send("Hello, we are working on MongoDB crud");
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port : ${port}`);
});
