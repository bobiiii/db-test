const express = require('express');
const userRoutes = require('./userRoutes');
const blogsRoutes = require('./blogsRoutes');
const visualizerRoutes = require('./visualizerRoutes');
const collectionRoutes = require('./collectionRoutes');
const queryRoutes = require('./queryRoutes');
const newsLetterRoutes = require('./newsLetterRoutes');
const contactRoutes = require('./contactRoutes');
const galleryRoutes = require('./galleryRoutes');
const metadataRoutes = require('./metadataRoutes');

const apiRoutes = express.Router();
apiRoutes.use('/user', userRoutes);
apiRoutes.use('/blog', blogsRoutes);
apiRoutes.use('/visualizer', visualizerRoutes);
apiRoutes.use('/collection', collectionRoutes);
apiRoutes.use('/gallery', galleryRoutes);
apiRoutes.use('/query', queryRoutes);
apiRoutes.use('/newsletter', newsLetterRoutes);
apiRoutes.use('/contact', contactRoutes);
apiRoutes.use('/metadata', metadataRoutes);
apiRoutes.use('*', (req, res) => { res.status(404).send('Route Not Found'); });

module.exports = apiRoutes;
