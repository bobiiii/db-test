const express = require('express');
const { userControllers } = require('../../controllers');
const { adminRoutes } = require('../../middlewares');

const userRoute = express.Router();

userRoute.post('/add-user', userControllers.addUserController);
userRoute.post('/login-user', userControllers.loginUserController);
userRoute.get('/get-users', userControllers.getUsers);
userRoute.put('/update-user/:userId', userControllers.updateUserController);
userRoute.delete('/delete-user/:userId',  userControllers.deleteUser);

module.exports = userRoute;
