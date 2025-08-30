// zenZone-backend/services/meditationService.js
const MeditationModel = require("../models/Meditation");
const Mood = require("../models/Mood");
const moment = require("moment");

const getOneMeditation = async (condition) => {
  return new Promise((resolve, reject) => {
    MeditationModel.findOne(condition)
      .sort({ date: "descending" })
      .populate("moods", "title")
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const buildQuery = async (body = {}) => {
  const q = {};

  // Search filter for title or description
  if (body.search) {
    q.$or = [
      { title: { $regex: body.search, $options: "i" } },
      { description: { $regex: body.search, $options: "i" } },
    ];
  }

  // Filter by date range
  if (body.date) {
    q.date = {
      $gte: `${body.date}-1`,
      $lte: moment([body.date.split("-")[0], body.date.split("-")[1] - 1])
        .endOf("month")
        .format("YYYY-MM-DD")
        .toString(),
    };
  }

  // Filter by "past" meditations
  if (body.filter === "past") {
    q.date = { $lte: moment().utc().format("YYYY-MM-DD") };
  }

  // Filter by mood if provided (now we expect a string, not ObjectId)
  if (body.mood) {
    q.moods = { $in: [new RegExp(`^${body.mood}$`, "i")] }; // String match in moods array
  }

  return q;
};

const getAllMeditations = async (body) => {
  try {
    const q = await buildQuery(body); // Build query based on filters

    const [meditations, count] = await Promise.all([
      MeditationModel.find(q)
        .sort({ date: "descending" })
        .limit(body?.take ? body?.take : 10)
        .skip(body?.skip ? body?.skip : 0)
        .populate("moods", "title"), // Populate moods field with title
      MeditationModel.countDocuments(q),
    ]);

    return { count, meditations };
  } catch (err) {
    console.error("Error in fetching meditations:", err);
    throw err;
  }
};

const updateMeditation = async (condition, data) => {
  return new Promise((resolve, reject) => {
    MeditationModel.findOneAndUpdate(condition, data, { new: true })
      .populate("moods", "title")
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const deleteMeditation = async (condition) => {
  return new Promise((resolve, reject) => {
    MeditationModel.deleteOne(condition)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const addMeditation = async (data) => {
  try {
    // Get mood ObjectIds for the provided moods (which are strings)
    const moodObjects = await Mood.find({ title: { $in: data.moods } });

    // If any moods are not found, throw an error
    if (moodObjects.length !== data.moods.length) {
      throw new Error("One or more moods not found in the database.");
    }

    // Map the mood titles to ObjectId
    const moodIds = moodObjects.map((mood) => mood._id);

    // Create and save the meditation with the mood ObjectIds
    const newMeditation = new MeditationModel({
      title: data.title,
      description: data.description,
      image: data.image,
      audio: data.audio,
      date: data.date,
      moods: moodIds, // Store mood ObjectIds
    });

    const savedMeditation = await newMeditation.save();

    // Return populated meditation with moods
    const populatedMeditation = await MeditationModel.findById(
      savedMeditation._id
    ).populate("moods", "title");

    return populatedMeditation;
  } catch (err) {
    console.error("Error in adding meditation:", err);
    throw err;
  }
};

module.exports = {
  getOneMeditation,
  updateMeditation,
  deleteMeditation,
  addMeditation,
  getAllMeditations,
};
