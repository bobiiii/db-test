// eslint-disable-next-line import/no-extraneous-dependencies
const mongooose = require('mongoose');

const colorsSchema = new mongooose.Schema({
  colorName: {
    type: String,
    required: true,
  },
  colorCardImage: {
    type: String,
    required: true,
  },
  mainImage: {
    type: String,
    required: true,
  },
});

const kitchenSchema = new mongooose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    cardImage: {
      type: String,
      required: true,
      trim: true,
    },
    colors: [colorsSchema],

  },
  {
    timestamps: true,
  },
);

const kitchenModel = mongooose.model('kitchens', kitchenSchema);

module.exports = kitchenModel;
