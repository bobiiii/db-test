const express = require('express');
require('dotenv').config();

const app = express();
const cors = require('cors');
const apiRoutes = require('../src/routes');
const db = require('../src/DB/index');
const { globalErrorHandler } = require('../src/utils/errorHandler');

db.startDB();
app.use(express.json());

const corsOptions = {
  // origin:'https://abc.onrender.com',
  AccessControlAllowOrigin: '*',
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};
app.use(cors(corsOptions));

app.use('/api', apiRoutes);
app.use(globalErrorHandler);
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Working fine' });
});

// only enable it in local environment
// it will not work on vercel

if (process.env.NODE_ENV === 'development') {
  app.listen(process.env.PORT, () => {
    console.log(`server is running on localhost:${process.env.PORT}`);
  });
}

module.exports = app;
