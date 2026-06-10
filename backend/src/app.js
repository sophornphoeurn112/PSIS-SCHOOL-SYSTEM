require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorMiddleware = require('./middleware/error.middleware');
const loggingMiddleware = require('./middleware/logging.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggingMiddleware);
app.use('/api', routes);
app.use(errorMiddleware);

module.exports = app;
