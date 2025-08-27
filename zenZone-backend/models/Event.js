const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  detail: {
    type: String,
  },
});

const EventModel = mongoose.model("event", eventSchema);
module.exports = EventModel;
