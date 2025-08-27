const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sheetSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },
});

const SheetModel = mongoose.model("sheet", sheetSchema);
module.exports = SheetModel;
