const express = require('express');
const { userControllers } = require('../../controllers');
const { adminRoutes } = require('../../middlewares');

const userRoute = express.Router();

userRoute.post('/add-user', adminRoutes, userControllers.addUserController);
userRoute.post('/login-user', adminRoutes, userControllers.loginUserController);
userRoute.get('/get-users', adminRoutes, userControllers.getUsers);
userRoute.put('/update-user/:userId', adminRoutes, userControllers.updateUserController);
userRoute.delete('/delete-user/:userId', adminRoutes, userControllers.deleteUser);

module.exports = userRoute;
