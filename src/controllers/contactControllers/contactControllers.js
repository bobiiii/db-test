const nodemailer = require('nodemailer');
const { contactModel } = require('../../models');
const { asyncHandler } = require('../../utils/asyncHandler');
const { ErrorHandler } = require('../../utils/errorHandler');
const { uploadImageToDrive, deleteImage } = require('../uploadImageController');
require('dotenv').config();

const createContact = asyncHandler(async (req, res, next) => {
  const { files } = req;

  const upload = files.find((item) => item.fieldname === 'upload');

  let {
    // eslint-disable-next-line prefer-const
    location, zipcode, firstname, lastname, email, mobile, subject, message, checked,
  } = req.body;

  // eslint-disable-next-line max-len
  if (!location || !zipcode || !email || !firstname || !lastname || !mobile || !subject || !message || !upload || !checked) {
    return next(new ErrorHandler('Please fill all required fields', 400));
  }
  const contactExist = await contactModel.findOne({ email });
  if (contactExist) {
    next(new ErrorHandler('contact already exists', 409));
  }

  const uploadId = await uploadImageToDrive(upload);

  const addContactDB = contactModel.create({
    location,
    zipcode,
    firstname,
    lastname,
    email,
    mobile,
    subject,
    message,
    upload: uploadId,
    checked,
  });

  if (!addContactDB) {
    next(new ErrorHandler('Unable to add contact', 500));
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
      next(new ErrorHandler('Email Not Send To contact user', 400));
    }
  });

  return res.status(200).json({ message: 'contact added successfully' });
});

const getContact = asyncHandler(async (req, res, next) => {
  const { contactId } = req.params;

  const findContact = await contactModel.findById(contactId);
  if (!findContact) {
    return next(new ErrorHandler('Contact Does Not Exist', 400));
  }
  return res.status(200).json({ data: findContact });
});

const getAllContacts = asyncHandler(async (req, res, next) => {
  const contacts = await contactModel.find({});
  if (!contacts) {
    next(new ErrorHandler('No contacts found ', 400));
  }
  return res.status(200).json({ data: contacts });
});
const deleteContact = asyncHandler(async (req, res, next) => {
  const { contactId } = req.params;

  const contactDelete = await contactModel.findById(contactId);
  if (!contactDelete) {
    return next(new ErrorHandler('Contact Does Not Exist'));
  }

  const { upload } = contactDelete;
  await deleteImage(upload);
  await contactModel.findByIdAndDelete(contactId);

  return res.status(200).json({ message: 'contact successfully deleted' });
});

module.exports = {
  createContact,
  getContact,
  getAllContacts,
  deleteContact,
};
