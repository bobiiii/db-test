// eslint-disable-next-line import/no-extraneous-dependencies
const mongooose = require('mongoose');

const varietySchema = new mongooose.Schema({
  varietyName: {
    type: String,
    required: true,
  },
  varietyCardImage: {
    type: String,
    required: true,
  },
  fullSlabImage: {
    type: String,
    required: true,
  },
  closeLookUp: {
    type: String,
    required: true,
  },
  instalLook: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  grip: {
    type: String,
    required: true,
  },
  mate: {
    type: String,
    required: true,
  },
  thickness: {
    type: String,
    required: true,
  },
});

const collectionSchema = new mongooose.Schema(
  {
    collectionName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
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
