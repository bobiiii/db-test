// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt');
const { userModel } = require('../../models');
const { ErrorHandler } = require('../../utils/errorHandler');
const { asyncHandler } = require('../../utils/asyncHandler');
const { sendCookieToken } = require('../authControllers');

const addUserController = asyncHandler(async (req, res, next) => {
  let {
    // eslint-disable-next-line prefer-const
    name, email, password, role,
  } = req.body;

  console.log("body", req.body);


  if (!name || !email || !password || !role) {
    return next(new ErrorHandler('Please fill all required fields', 400));
  }
  const userExist = await userModel.findOne({ email });
  if (userExist) {
    return next(new ErrorHandler('User already exists', 409));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const addUserDB = await userModel.create({
    name,
    email,
    password: hashedPassword,
    role,
  });
  if (!addUserDB) {
    return next(new ErrorHandler('Unable to add user', 500));
  }
  return res.status(200).json({ message: 'User added successfully', status: 'Success' });
});

const loginUserController = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('Please fill all required fields', 400));
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new ErrorHandler('User doesn\'t exist', 404));
  }

  const userExist = await bcrypt.compare(password, user.password);

  if (!userExist) {
    return next(new ErrorHandler('Email or password is incorrect', 401));
  }

  return sendCookieToken(user, 200, req, res);
});

const getUsers = asyncHandler(async (req, res, next) => {
  const users = await userModel.find({});
  if (!users) {
    next(new ErrorHandler('No users found ', 400));
  }
  return res.status(200).json({ data: users });
});

const updateUserController = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  let {
    // eslint-disable-next-line prefer-const
    name, email, password, role,
  } = req.body;

  const userExist = await userModel.findById(userId);

  if (!userExist) {
    return next(new ErrorHandler('User dosent  exists', 404));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  name = name.toLowerCase();
  const updateUserDB = await userModel.findByIdAndUpdate(userId, {
    name,
    email,
    password: hashedPassword,
    role,
  });

  if (!updateUserDB) {
    return next(new ErrorHandler('Unable to update user', 500));
  }

  return res.status(200).json({ message: 'User updated successfully', UpdtData: updateUserDB });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const user = await userModel.deleteOne({ _id: userId });
  if (!user) {
    next(new ErrorHandler('No user found ', 400));
  }
  return res.status(200).json({ message: 'User deleted successfully' ,status:'Success'});
});

module.exports = {
  addUserController,
  loginUserController,
  getUsers,
  updateUserController,
  deleteUser,
};
