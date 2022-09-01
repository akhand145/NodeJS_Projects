const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

const index = require('./src/models/index');

// port
const port = process.env.PORT;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const userRoute = require('./src/routes/user.route');
const postRoute = require('./src/routes/post.route');

app.use('/', userRoute);
app.use('/api/post', postRoute);


// testing api
app.get('/', (req, res) => {
    res.json("Hello, we are working with jwt");
});

// server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${port}`);
}); 
