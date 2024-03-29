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

const bathroomSchema = new mongooose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    cardImage: {
      type: Date,
      required: true,
      trim: true,
    },
    colors: [colorsSchema],

  },
  {
    timestamps: true,
  },
);

const bathroomModel = mongooose.model('bathrooms', bathroomSchema);

module.exports = bathroomModel;
