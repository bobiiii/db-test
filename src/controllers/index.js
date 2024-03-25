const userControllers = require('./userControllers');
const blogsControllers = require('./blogControllers');
const authControllers = require('./authControllers');
const visualizerControllers = require('./visualizerControllers');
const collectionControllers = require('./collectionControllers');
const { uploadImageToDrive } = require('./uploadImageController');

module.exports = {
  userControllers,
  blogsControllers,
  authControllers,
  visualizerControllers,
  collectionControllers,
  uploadImageToDrive,
};
