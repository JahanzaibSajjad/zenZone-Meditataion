// zenZone-backend/models/Meditation.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const meditationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    audio: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    moods: [String],
  },
  { timestamps: true }
);

// Helpful indexes for search & filtering
meditationSchema.index({ title: "text", description: "text" });
meditationSchema.index({ moods: 1 });
meditationSchema.index({ date: -1 });

const MeditationModel = mongoose.model("meditation", meditationSchema);
module.exports = MeditationModel;
