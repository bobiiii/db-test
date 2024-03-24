const express = require('express');
require('dotenv').config();

const app = express();
// const port = process.env.port || 4000;
const cors = require('cors');
const apiRoutes = require('../src/routes');
const db = require('../src/DB/index');
const { globalErrorHandler } = require('../src/utils/errorHandler');

db.startDB();
app.use(express.json());
const corsConfig = {
  origin: '*S',
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

app.get('/ab', (req, res) => {
  res.status(200).json({ message: 'Working fine' });
});

// const server = app.listen(port, () => {
//   db.startDB();
//   console.log(`server running on localhost:${port}`);
// });

// function shutDown() {
//   console.log('Received kill signal, shutting down gracefully');
//   server.close(() => {
//     console.log('Closed out remaining connections');
//     process.exit(0);
//   });

//   setTimeout(() => {
//     console.error('Could not close connections in time, forcefully shutting down');
//     process.exit(1);
//   }, 10000);
// }

// // Server shutdown logic
// process.on('SIGTERM', shutDown);
// process.on('SIGINT', shutDown);

module.exports = app;
