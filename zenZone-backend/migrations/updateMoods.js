// Required modules
const mongoose = require("mongoose");
const Meditation = require("../models/Meditation");
const Mood = require("../models/Mood");

// MongoDB Atlas URI (replace it with your actual URI)
const DB_URI =
  "mongodb+srv://jahanzaibsajjad077:sUzT0Q1GNwP2iKxT@cluster0.vhxlc6e.mongodb.net/your-db-name?retryWrites=true&w=majority";

// Connect to MongoDB (adjust connection string to your actual DB URI)
mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    // Fetch all the moods by title (or you can hard-code these if you know them)
    const calmMood = await Mood.findOne({ title: "Calm" });
    const sleepMood = await Mood.findOne({ title: "Sleep" });

    // Log the results to check if they are being found correctly
    console.log("Calm Mood:", calmMood);
    console.log("Sleep Mood:", sleepMood);

    // Check if the moods were found
    if (!calmMood || !sleepMood) {
      console.log(
        "Moods not found! Make sure the 'Calm' and 'Sleep' moods exist."
      );
      return;
    }

    // Fetch all meditations with the old mood values (strings)
    const meditations = await Meditation.find({
      moods: { $in: ["Calm", "Sleep"] },
    });

    console.log("Meditations found:", meditations);

    // Loop through each meditation and update the moods to use ObjectId references
    for (let meditation of meditations) {
      const updatedMoods = meditation.moods
        .map((mood) => {
          if (mood === "Calm" && calmMood) return calmMood._id;
          if (mood === "Sleep" && sleepMood) return sleepMood._id;
          return null; // If the mood is not found, ignore it
        })
        .filter((mood) => mood !== null); // Filter out nulls

      // Update the meditation with the ObjectId references for moods
      meditation.moods = updatedMoods;
      await meditation.save();
    }

    console.log("Moods updated successfully!");
  })
  .catch((err) => console.log("Error in migration:", err))
  .finally(() => mongoose.disconnect());
