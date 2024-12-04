// eslint-disable-next-line import/no-extraneous-dependencies
const mongooose = require('mongoose');

const varietySchema = new mongooose.Schema({
  varietyName: {
    type: String,
  },
  slug: {
    type: String,
    required: true,
  },
  varietyCardImage: {
    type: String,
  },
  fullSlabImage: {
    type: String,
  },
  closeLookUp: {
    type: String,
  },
  instalLook: {
    type: String,
  },
  description: {
    type: String,
  },
  grip: {
    type: String,
  },
  mate: {
    type: String,
  },
  thickness: {
    type: String,
  },
});

const collectionSchema = new mongooose.Schema(
  {
    collectionHeading: {
      type: String,
      required: true,
      trim: true,
    },
    collectionName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
    },
    collectionImage: {
      type: String,
      required: true,
      trim: true,
    },
    dropDownImage: {
      type: String,
      required: true,
    },
    variety: [varietySchema],
  },
  {
    timestamps: true,
  },
);

const collectionModel = mongooose.model('collections', collectionSchema);

module.exports = collectionModel;
