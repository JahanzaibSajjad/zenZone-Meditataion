const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cvideoSchema = new Schema({
  home_1: {
    url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  home_2: {
    url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  meditation: {
    url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  biochemical: {
    url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
});

const CompulsoryVideoModel = mongoose.model("cvideo", cvideoSchema);
module.exports = CompulsoryVideoModel;
