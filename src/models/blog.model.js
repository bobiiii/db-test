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
    cardImage: {
      type: String,
      required: true,
    },
    bannerImage: {
      type: String,
      required: true,
    },
    headingOne: {
      type: String,
      required: true,
    },
    paragraphOne: {
      type: String,
      required: true,
    },
    imageOne: {
      type: String,
      required: true,
    },
    headingTwo: {
      type: String,
      required: true,
    },
    paragraphTwo: {
      type: String,
      required: true,
    },
    imageTwo: {
      type: String,
      required: true,
    },
    headingThree: {
      type: String,
      required: true,
    },
    paragraphThree: {
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
