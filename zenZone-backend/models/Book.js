const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    required: true,
  },
  url: {
    type: String,
  },
  description: {
    type: String,
  },
});

const BookModel = mongoose.model("book", bookSchema);
module.exports = BookModel;
