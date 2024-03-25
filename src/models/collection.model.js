// eslint-disable-next-line import/no-extraneous-dependencies
const mongooose = require('mongoose');

const varietySchema = new mongooose.Schema({
  varietyName: {
    type: String,
    require: true,
  },
  varietyCardImage: {
    type: String,
    require: true,
  },
  fullSlabImage: {
    type: String,
    require: true,
  },
  closeLookUp: {
    type: String,
    require: true,
  },
  instalLook: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  grip: {
    type: String,
    require: true,
  },
  mate: {
    type: String,
    require: true,
  },
  thickness: {
    type: String,
    require: true,
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
