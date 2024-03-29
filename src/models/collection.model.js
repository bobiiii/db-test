// eslint-disable-next-line import/no-extraneous-dependencies
const mongooose = require('mongoose');

const varietySchema = new mongooose.Schema({
  varietyName: {
    type: String,
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
