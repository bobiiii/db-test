// eslint-disable-next-line import/no-extraneous-dependencies
const mongooose = require('mongoose');

const colorsSchema = new mongooose.Schema({
  colorName: {
    type: String,
  },
  slug: {
    type: String,
    required: true,
  },
  colorCardImage: {
    type: String,
  },
  mainImage: {
    type: String,
  },
});

const kitchenSchema = new mongooose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Kitchen', 'Bathroom'],
      required: true,
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
