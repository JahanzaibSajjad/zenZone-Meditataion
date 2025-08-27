const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const websiteSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const WebsiteModel = mongoose.model("website", websiteSchema);
module.exports = WebsiteModel;
