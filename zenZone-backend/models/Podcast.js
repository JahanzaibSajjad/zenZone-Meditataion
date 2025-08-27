const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const podcastSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
});

const PodcastModel = mongoose.model("podcast", podcastSchema);
module.exports = PodcastModel;
