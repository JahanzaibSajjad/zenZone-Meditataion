const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const VideoModel = mongoose.model("video", videoSchema);
module.exports = VideoModel;
