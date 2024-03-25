/* eslint-disable no-unused-vars */
const { asyncHandler } = require('../../utils/asyncHandler');
const { ErrorHandler } = require('../../utils/errorHandler');
const { collectionModel } = require('../../models');

const addCollection = asyncHandler(async (req, res, next) => {
  const { collectionName, collectionImage, dropDownImage } = req.body;
  if (collectionName || collectionImage || dropDownImage !== '') {
    return next(new ErrorHandler('Please send valid fields', 400));
  }
  // eslint-disable-next-line max-len
  const collection = await collectionModel.create({ collectionName, collectionImage, dropDownImage });

  if (!collection) {
    return next(new ErrorHandler('unable to create collection', 400));
  }
  return res.status(200).json({ message: 'Created successfully' });
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
