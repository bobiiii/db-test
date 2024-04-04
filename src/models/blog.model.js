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
    blogImage: {
      type: String,
      required: true,
    },
    bannerImage: {
      type: String,
      required: true,
    },
    contentOne: {
      type: String,
      required: true,
    },
    heading: {
      type: String,
      required: true,
    },
    contentImage: {
      type: String,
      required: true,
    },
    contentTwo: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const blogModel = mongooose.model('blogs', blogSchema);

module.exports = blogModel;
