const JWT = require('jsonwebtoken');
const { asyncHandler } = require('../utils/asyncHandler');
const { ErrorHandler } = require('../utils/errorHandler');
require('dotenv').config();
const { userModel } = require('../models');

// eslint-disable-next-line consistent-return
const adminRoutes = asyncHandler(async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return next(new ErrorHandler('Unauthorized - No token provided', 401));
  }

  const decoded = JWT.verify(token, process.env.SECRET_KEY);
  // console.log(decoded);
  if (!decoded) {
    return next(new ErrorHandler('Unauthorized - Invalid token', 401));
  }
  const { id } = decoded;
  const admin = await userModel.findById(id);

  if (admin.role === 'ADMIN') {
    return next();
  }
  return next(new ErrorHandler('Unauthorized Acess!', 401));
});

module.exports = { adminRoutes };
