/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const cors = require('cors');
const apiRoutes = require('../src/routes');
const db = require('../src/DB/index');
const { globalErrorHandler } = require('../src/utils/errorHandler');
// const {  updateVarieties, updateVcolslug, updatecolor } = require('../src/models/addslug');

app.use(express.json());
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
app.use(bodyParser.json({ limit: '500mb', extended: true }));

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://sharifstone.com',
      'https://www.sharifstone.com',
      'https://dashboard.sharifstone.com',
      'https://sharif-stone-dashboard.vercel.app',
      // 'https://sharif-stone-dashboard.vercel.app',
      // 'https://master.d2u1pm0dta5ggo.amplifyapp.com',
      // 'https://sharif-stone-frontend.vercel.app',
      // 'https://sharif-dashboard-w3ml.vercel.app',
      // 'https://master.deamd160utbn6.amplifyapp.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, token',
  }),
);

app.use(cors());
app.use('/api', apiRoutes);
app.use(globalErrorHandler);
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Working fine' });
});

// only enable it in local environment
if (process.env.NODE_ENV === 'production') {
  app.listen(process.env.PORT, () => {
    db.startDB();
    console.log(`(Prod) server is running on localhost:${process.env.PORT}`);
  });
}

// it will not work on vercel
if (process.env.NODE_ENV === 'development') {
  app.listen(process.env.PORT, () => {
    console.log(`server is running on localhost:${process.env.PORT}`);
  });
}

module.exports = app;
