const newsletterModel = require('../../models/newsletter.model');
const { asyncHandler } = require('../../utils/asyncHandler');
const { ErrorHandler } = require('../../utils/errorHandler');

const createNewsletter = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler('Please provide valid email', 400));
  }
  const added = await newsletterModel.create({ email });
  if (!added) {
    next(new ErrorHandler('Unable to add email to database', 500));
  }
  return res.status(200).json({ message: 'Email added successfully' });
});
const getAllNewsletter = asyncHandler(async (req, res, next) => {
  const newsletters = await newsletterModel.find({});
  if (!newsletters.length) {
    next(new ErrorHandler('No Emails Found', 500));
  }
  return res.status(200).json({ data: newsletters });
});
const deleteNewsletter = asyncHandler(async (req, res, next) => {
  const { newsletterId } = req.params;

  const newsletters = await newsletterModel.findByIdAndDelete(newsletterId);
  if (!newsletters) {
    next(new ErrorHandler('No Emails Found', 500));
  }
  return res.status(200).json({ message: 'Email deleted successfully', status: 'Success' });
});

module.exports = {
  createNewsletter,
  getAllNewsletter,
  deleteNewsletter,
};
