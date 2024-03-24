/* eslint-disable no-unused-vars */
const { asyncHandler } = require('../../utils/asyncHandler');

const getKitchen = asyncHandler(async (req, res, next) => res.status(200).send('working'));
const addKitchen = asyncHandler(async (req, res, next) => res.status(200).send('working'));
const updateKitchen = asyncHandler(async (req, res, next) => res.status(200).send('working'));
const deleteKitchen = asyncHandler(async (req, res, next) => res.status(200).send('working'));
const getBathrooms = asyncHandler(async (req, res, next) => res.status(200).send('working'));
const addBathroom = asyncHandler(async (req, res, next) => res.status(200).send('working'));
const updateBathroom = asyncHandler(async (req, res, next) => res.status(200).send('working'));
const deleteBathroom = asyncHandler(async (req, res, next) => res.status(200).send('working'));

module.exports = {
  getKitchen,
  addKitchen,
  updateKitchen,
  deleteKitchen,
  getBathrooms,
  addBathroom,
  updateBathroom,
  deleteBathroom,
};
