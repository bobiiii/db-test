const express = require('express');
const multer = require('multer');
const { contactControllers } = require('../../controllers');
// const { adminRoutes } = require('../../middlewares');

const upload = multer();

const contactRoute = express.Router();

contactRoute.post('/add-contact', upload.any(), contactControllers.createContact);
contactRoute.get('/:contactId', contactControllers.getContact);
contactRoute.get('/', contactControllers.getAllContacts);
contactRoute.delete('/delete-contact/:contactId', contactControllers.deleteContact);

module.exports = contactRoute;
