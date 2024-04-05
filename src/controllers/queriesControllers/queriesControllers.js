// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');
const { queryModel } = require('../../models');
const { asyncHandler } = require('../../utils/asyncHandler');
const { ErrorHandler } = require('../../utils/errorHandler');
const { uploadImageToDrive, deleteImage } = require('../uploadImageController');

const createQuery = asyncHandler(async (req, res, next) => {
  const { files } = req;

  const image = files.find((item) => item.fieldname === 'image');

  let {
    // eslint-disable-next-line prefer-const
    firstname, lastname, email, mobile, options, message,
  } = req.body;

  // eslint-disable-next-line max-len
  if (!email || !firstname || !lastname || !mobile || !options || !message || !image) {
    return next(new ErrorHandler('Please fill all required fields', 400));
  }

  const imageId = await uploadImageToDrive(image);

  const addqueryDB = queryModel.create({
    firstname,
    lastname,
    email,
    mobile,
    options,
    message,
    image: imageId,
  });

  if (!addqueryDB) {
    next(new ErrorHandler('Unable to add query', 500));
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.AUTH,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.AUTH,
    to: email,
    subject: 'nodemailer Test',
    text: 'test Sending gmail using Node js',
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      next(new ErrorHandler('Email Not Send To Query', 400));
    }
  });

  return res.status(200).json({ message: 'query added successfully' });
});

const getQuery = asyncHandler(async (req, res, next) => {
  const { queryId } = req.params;

  const findQuery = await queryModel.findById(queryId);
  if (!findQuery) {
    return next(new ErrorHandler('Query Does Not Exist', 400));
  }
  return res.status(200).json({ data: findQuery });
});

const getAllQuery = asyncHandler(async (req, res, next) => {
  const queries = await queryModel.find({});
  if (!queries) {
    next(new ErrorHandler('No queries found ', 400));
  }
  return res.status(200).json({ data: queries });
});
const deleteQuery = asyncHandler(async (req, res, next) => {
  const { queryId } = req.params;

  const queryDelete = await queryModel.findById(queryId);
  if (!queryDelete) {
    return next(new ErrorHandler('Query Does Not Exist'));
  }

  const { image } = queryDelete;
  await deleteImage(image);
  await queryModel.findByIdAndDelete(queryId);

  return res.status(200).json({ message: 'query successfully deleted' });
});

module.exports = {
  createQuery,
  getQuery,
  getAllQuery,
  deleteQuery,
};
