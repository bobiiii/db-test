/* eslint-disable no-unused-vars */
const { asyncHandler } = require('../../utils/asyncHandler');
const { ErrorHandler } = require('../../utils/errorHandler');
const { collectionModel } = require('../../models');

const addCollection = asyncHandler(async (req, res, next) => {
  let {
    // eslint-disable-next-line prefer-const
    collectionName, collectionImage, dropDownImage, variety,
  } = req.body;

  // eslint-disable-next-line eqeqeq
  if (collectionName && collectionImage && dropDownImage === '' && variety) {
    return next(new ErrorHandler('Please fill all required fields', 400));
  }
  const [{
    varietyName,
    varietyCardImage,
    fullSlabImage,
    closeLookUp,
    instalLook,
    description,
    grip,
    mate,
    thickness,
  }] = variety;

  const collectionExist = await collectionModel.findOne({ collectionName });
  if (collectionExist) {
    next(new ErrorHandler('Collection already exists', 409));
  }

  name = name.toLowerCase();
  const hashedPassword = await bcrypt.hash(password, 10);

  const addUserDB = await userModel.create({
    name,
    email,
    password: hashedPassword,
    role,
  });
  if (!addUserDB) {
    next(new ErrorHandler('Unable to add user', 500));
  }
  return res.status(200).send({ message: 'User added successfully', data: addUserDB });
});

const getCollection = asyncHandler(async (req, res, next) => res.status(200).send('working'));
const updateCollection = asyncHandler(async (req, res, next) => res.status(200).send('working'));
const deleteCollection = asyncHandler(async (req, res, next) => res.status(200).send('working'));
const getCollections = asyncHandler(async (req, res, next) => res.status(200).send('working'));

module.exports = {
  addCollection,
  getCollection,
  updateCollection,
  deleteCollection,
  getCollections,
};
