const express = require('express');
const userRoutes = require('./userRoutes');
const blogsRoutes = require('./blogsRoutes');
const visualizerRoutes = require('./visualizerRoutes');
const collectionRoutes = require('./collectionRoutes');

const apiRoutes = express.Router();
apiRoutes.use('/user', userRoutes);
apiRoutes.use('/blog', blogsRoutes);
apiRoutes.use('/visualizer', visualizerRoutes);
apiRoutes.use('/collection', collectionRoutes);
apiRoutes.use('*', (req, res) => { res.status(404).send('Route Not Found'); });

module.exports = apiRoutes;
