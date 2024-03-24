const express = require('express');
require('dotenv').config();

const app = express();
const cors = require('cors');
const apiRoutes = require('../src/routes');
const db = require('../src/DB/index');
const { globalErrorHandler } = require('../src/utils/errorHandler');

db.startDB();
app.use(express.json());
const corsConfig = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
app.use(cors(corsConfig));
app.options('', cors(corsConfig));
app.use('/api', apiRoutes);
app.use(globalErrorHandler);
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Working fine' });
});

module.exports = app;
