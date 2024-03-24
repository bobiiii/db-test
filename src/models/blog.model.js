// eslint-disable-next-line import/no-extraneous-dependencies
const mongooose = require('mongoose');

const blogSchema = new mongooose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      trim: true,
    },
    views: {
      type: Number,
      required: true,
    },
    imageRef: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  },
);

const blogModel = mongooose.model('blogs', blogSchema);

module.exports = blogModel;
