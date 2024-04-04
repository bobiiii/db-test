// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');
const { queryModel } = require('../../models');
const { asyncHandler } = require('../../utils/asyncHandler');
const { ErrorHandler } = require('../../utils/errorHandler');

const createQuery = asyncHandler(async (req, res, next) => {
  let {
    // eslint-disable-next-line prefer-const
    location, zipcode, firstname, lastname, email, mobile, subject, message, sendmail,
  } = req.body;

  // eslint-disable-next-line max-len
  if (!location || !email || !zipcode || !firstname || !lastname || !mobile || !subject || !message || !sendmail) {
    return next(new ErrorHandler('Please fill all required fields', 400));
  }
  const userExist = await queryModel.findOne({ email });
  if (userExist) {
    next(new ErrorHandler('Query already exists', 409));
  }

  const addqueryDB = queryModel.create({
    location,
    zipcode,
    firstname,
    lastname,
    email,
    mobile,
    subject,
    message,
    sendmail,
  });

  if (!addqueryDB) {
    next(new ErrorHandler('Unable to add user', 500));
  }

  if (sendmail === true) {
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
  }

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
  const queriess = await queryModel.find({});
  if (!queriess) {
    next(new ErrorHandler('No users found ', 400));
  }
  return res.status(200).json({ data: queriess });
});
const deleteQuery = asyncHandler(async (req, res, next) => {
  const { queryId } = req.params;

  const queryDelete = queryModel.findByIdAndDelete(queryId);

  if (queryDelete) {
    return res.status(200).json({ message: 'Query Delete SuccessFully' });
  }
  return next(new ErrorHandler('Query Does Not Exist'));
});

module.exports = {
  createQuery,
  getQuery,
  getAllQuery,
  deleteQuery,
};
