const userControllers = require('./userControllers');
const blogsControllers = require('./blogControllers');
const authControllers = require('./authControllers');
const visualizerControllers = require('./visualizerControllers');
const collectionControllers = require('./collectionControllers');
const queriesControllers = require('./queriesControllers');
const { uploadImageToDrive } = require('./uploadImageController');

module.exports = {
  userControllers,
  blogsControllers,
  authControllers,
  visualizerControllers,
  collectionControllers,
  queriesControllers,
  uploadImageToDrive,
};
