// eslint-disable-next-line import/no-extraneous-dependencies
const mongooose = require('mongoose');

const querySchema = new mongooose.Schema(
  {
    location: {
      type: String,
      required: true,
      trim: true,
    },
    zipcode: {
      type: String,
      required: true,
      trim: true,
    },
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    mobile: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    sendmail: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
);

const queryModel = mongooose.model('queries', querySchema);

module.exports = queryModel;
