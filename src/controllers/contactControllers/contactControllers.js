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
    location, zipcode, firstname, lastname, email, mobile, subject, message, checked,
  } = req.body;

  // eslint-disable-next-line max-len
  if (!location || !zipcode || !email || !firstname || !lastname || !mobile || !subject || !message || !upload || !checked) {
    return next(new ErrorHandler('Please fill all required fields', 400));
  }

  if (!isImage(upload)) {
    return next(new ErrorHandler('Only images are allowed', 400));
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
    subject: 'Thank you for contacting Sharif Stone',
    html: `
      <html>
        <body>
          <p>Dear ${firstname},</p>
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
    from: process.env.AUTH,
    to: process.env.ADMIN_EMAIL,
    subject: 'New Contact Form Submission on Sharif Stone Website',
    html: `
      <html>
        <body>
          <p>Hello Admin,</p>
          <p>A new user has contacted through the Sharif Stone website. Here are the details:</p>
          <ul>
            <li>Name: ${firstname} ${lastname}</li>
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
      console.error('Error sending email to admin:', error);
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
