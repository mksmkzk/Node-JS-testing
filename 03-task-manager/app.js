// Dependencies
const express = require('express');
const tasks = require('./routes/tasks')
const connectDB = require('./db/connect');
require('dotenv').config();
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// Global Variables
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static('./public'));
app.use(express.json());

app.use(errorHandlerMiddleware);

// Routes
app.use('/api/v1/tasks', tasks)

app.use(notFound);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`server is listening on port ${port}...`));
    } catch (error) {
        console.log(error.message);
    }
}

start();



