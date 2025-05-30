const nodemailer = require('nodemailer');
const { contactModel } = require('../../models');
const { asyncHandler } = require('../../utils/asyncHandler');
const { ErrorHandler } = require('../../utils/errorHandler');
const { uploadImageToDrive, deleteImage, isImage } = require('../uploadImageController');
require('dotenv').config();

const createContact = asyncHandler(async (req, res, next) => {
  const { files } = req;

  const upload = files.find((item) => item.fieldname === 'upload');

  let {
    // eslint-disable-next-line prefer-const
    address, zipcode, fullName, email, mobile, subject, message, checked,
  } = req.body;

  // eslint-disable-next-line max-len
  if (!address || !zipcode || !email || !fullName || !mobile || !subject || !message || !upload) {
    return next(new ErrorHandler('Please fill all required fields', 400));
  }

  if (!isImage(upload)) {
    return next(new ErrorHandler('Only images are allowed', 400));
  }

  const uploadId = await uploadImageToDrive(upload);

  const addContactDB = contactModel.create({
    address,
    zipcode,
    fullName,
    email,
    mobile,
    subject,
    message,
    upload: uploadId,
    checked,
  });

  if (!addContactDB) {
    next(new ErrorHandler('An Error Occured!', 500));
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.AUTH,
      pass: process.env.PASSWORD,
    },
    replyTo: email,
  });

  const mailOptions = {
    from: process.env.AUTH,
    to: email,
    subject: 'Thank you for contacting Sharif Stone',
    html: `
      <html>
        <body>
          <p>Dear ${fullName},</p>
          <p>Thank you for contacting Sharif Stone. We have received your message and will get back to you shortly.</p>
          <p>Regards,</p>
          <p>Team Sharif Stone</p>
        </body>
      </html>
    `,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      next(new ErrorHandler('Email Not Send To contact user', 400));
    }
  });

  const adminMailOptions = {
    from: process.env.email,
    to: process.env.AUTH,
    subject: 'New Contact Form Submission on SharifStone! ',
    html: `
      <html>
        <body>
          <p>This is a template message from Sharifstone server</p>
          <p>A new user has contacted through the Sharif Stone website. Here are the details:</p>
          <br>
          <p>Please check dashboard for further details:</p>
          <br>
          <br>
          <ul>
            <li>Name: ${fullName}</li>
            <li>Email: ${email}</li>
            <li>Mobile: ${mobile}</li>
            <li>Message: ${message}</li>
          </ul>
          <p>Regards,</p>
          <p>Team Sharif Stone</p>
        </body>
      </html>
    `,
  };

  transporter.sendMail(adminMailOptions, (error) => {
    if (error) {
      console.error('Oops! An Error Occured during contact submission', error);
    }
  });

  return res.status(200).json({ status: 'Success', message: 'WE GOT YOU! We will back to you soon.' });
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
  return res.status(200).json({ status: 'Success', data: contacts });
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

  return res.status(200).json({ status: 'Success', message: 'contact successfully deleted' });
});

module.exports = {
  createContact,
  getContact,
  getAllContacts,
  deleteContact,
};
