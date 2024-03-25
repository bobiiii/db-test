/* eslint-disable no-unused-vars */
const { asyncHandler } = require('../../utils/asyncHandler');
const { ErrorHandler } = require('../../utils/errorHandler');
const { collectionModel } = require('../../models');

const addCollection = asyncHandler(async (req, res, next) => {
  let {
    // eslint-disable-next-line prefer-const
    collectionName, collectionImage, dropDownImage, variety,
  } = req.body;
  console.log(req.body);
  // eslint-disable-next-line eqeqeq
  if (collectionName || collectionImage || dropDownImage === '' || variety) {
    return next(new ErrorHandler('Please fill all required fields', 400));
  }

  const collectionExist = await collectionModel.findOne({ collectionName });
  if (collectionExist) {
    next(new ErrorHandler('Collection already exists', 409));
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

  // eslint-disable-next-line max-len
  if (!varietyName || !varietyCardImage || !fullSlabImage || !closeLookUp || !instalLook || !description || !grip || !mate || !thickness) {
    return next(new ErrorHandler('please fill all required fills in variety', 400));
  }

  const addCollectionDB = await collectionModel.create({
    collectionName,
    collectionImage,
    dropDownImage,
    variety: [{
      varietyName,
      varietyCardImage,
      fullSlabImage,
      closeLookUp,
      instalLook,
      description,
      grip,
      mate,
      thickness,
    }],
  });
  if (!addCollectionDB) {
    next(new ErrorHandler('Unable to add Collection', 500));
  }
  return res.status(200).send({ message: 'Collection added successfully', data: addCollectionDB });
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
