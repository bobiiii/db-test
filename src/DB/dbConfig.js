// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
require('dotenv').config();

const startDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected with MongoDb Atlas');
  } catch (error) {
    console.error('Error connecting with MongoDb:', error);
  }
};
module.exports = { startDB };
