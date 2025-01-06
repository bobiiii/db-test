const express = require('express');
const multer = require('multer');
const { contactControllers } = require('../../controllers');
const { adminRoutes } = require('../../middlewares');

const upload = multer();

const contactRoute = express.Router();

contactRoute.post('/add-contact', upload.any(), contactControllers.createContact);
contactRoute.get('/:contactId', adminRoutes, contactControllers.getContact);
contactRoute.get('/', adminRoutes, contactControllers.getAllContacts);
contactRoute.delete('/delete-contact/:contactId', adminRoutes, contactControllers.deleteContact);

module.exports = contactRoute;
