// zenZone-backend/models/Mood.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const moodSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    sheet: {
      type: Schema.Types.ObjectId,
      ref: "sheet",
      required: true,
    },
  },
  { timestamps: true }
);

moodSchema.index({ title: 1 });

const MoodModel = mongoose.model("mood", moodSchema);
module.exports = MoodModel;
