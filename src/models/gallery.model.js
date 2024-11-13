const mongooose = require('mongoose');

const gallerySchema = new mongooose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['kitchen', 'bathroom'],
      required: true,
    },
    mainImage: {
      type: String,
      required: true,
    },
    modalImages: [{
      // imageId: { type: String, required: true },
      applications: { type: String, required: true },
      location: { type: String, required: true },
      description: { type: String, required: true },

    }],
  },
);
const GalleryModel = mongooose.model('gallery', gallerySchema);

module.exports = GalleryModel;
