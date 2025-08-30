// zenZone-backend/controllers/meditationController.js
const meditationService = require("../services/meditationService");
const Meditation = require("../models/Meditation"); // NEW
const Mood = require("../models/Mood"); // NEW
const moment = require("moment");

// GET /meditations/:id
const getOneMeditation = async (req, res) => {
  console.log("Get onemeditation called");
  meditationService
    .getOneMeditation({ _id: req.params.id })
    .then((meditation) =>
      res.status(200).send(meditation ? meditation : "Meditation not found")
    )
    .catch((err) => res.status(500).send(err));
};

// POST /meditations  (list with paging/search/mood)

const getAllMeditations = async (req, res) => {
  try {
    const { skip = 0, take = 10, search = "", mood } = req.body || {};
    const q = {};

    // Handle search
    if (search) {
      q.$text = { $search: search }; // Search by title or description
    }

    console.log("mood received at backend is ->", mood);

    // Handle mood filter as string (direct matching with mood array in database)
    if (mood) {
      // Directly filter by the string mood in the array of moods
      q.moods = { $in: [mood] }; // Mood is directly a string, no need for ObjectId conversion
    }

    // Fetch meditations based on the query
    const [items, count] = await Promise.all([
      Meditation.find(q)
        .populate("moods", "title") // Populate the moods' titles (if you need them)
        .sort({ date: -1, createdAt: -1 })
        .skip(Number(skip)) // Pagination - skip
        .limit(Number(take)), // Pagination - limit
      Meditation.countDocuments(q), // Count of total documents matching the filter
    ]);

    // Return the filtered meditations and count
    return res.status(200).json({ meditations: items, count });
  } catch (err) {
    console.error("Error in fetching meditations:", err);
    return res.status(500).send(err);
  }
};

// GET /meditations  (today)
const getTodayMeditation = async (req, res) => {
  console.log("hello");
  const today = moment.utc(moment()).format("YYYY-MM-DD").toString();
  meditationService
    .getOneMeditation({ date: { $lte: new Date(today) } })
    .then((meditation) => res.status(200).send(meditation))
    .catch((err) => res.status(500).send(err));
};

// PUT /meditations/:id
const updateMeditation = async (req, res) => {
  try {
    if (req.body.date) {
      const alreadyExists = await meditationService.getOneMeditation({
        date: req.body.date,
      });
      if (alreadyExists && alreadyExists._id.toString() !== req.params.id) {
        return res.status(200).json({
          created: false,
          message: "Meditation already exists for the date",
        });
      }
    }

    // ensure moods is an array if provided
    if (req.body.moods && !Array.isArray(req.body.moods)) {
      req.body.moods = [];
    }

    meditationService
      .updateMeditation({ _id: req.params.id }, req.body)
      .then(async (meditation) => {
        // populate moods on the way out
        const populated = await Meditation.findById(meditation._id).populate(
          "moods",
          "title"
        );
        return res.status(200).json({
          created: true,
          message: "Meditation added",
          meditation: populated,
        });
      })
      .catch((err) => res.status(500).send(err));
  } catch (err) {
    res.status(500).send(err);
  }
};

// DELETE /meditations/:id
const deleteMeditation = async (req, res) => {
  meditationService
    .deleteMeditation({ _id: req.params.id })
    .then(() => res.status(200).send("Meditation is deleted!"))
    .catch((err) => res.status(500).send(err));
};

// POST /meditations/add
const addMeditation = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    if (!req.body.date) return res.status(422).send("Date not provided");

    if (req.body.moods && !Array.isArray(req.body.moods)) {
      req.body.moods = [req.body.moods];
    }

    console.log("Processed moods array:", req.body.moods);

    const alreadyExists = await meditationService.getOneMeditation({
      date: req.body.date,
    });
    if (alreadyExists) {
      return res.status(200).json({
        created: false,
        message: "Meditation already exists for the date",
      });
    }

    const newMeditation = new Meditation({
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      audio: req.body.audio,
      date: req.body.date,
      moods: req.body.moods,
    });

    await newMeditation.save();

    // Populate the moods with titles (optional, if needed for returning the names)
    const populatedMeditation = await Meditation.findById(
      newMeditation._id
    ).populate("moods", "title");

    return res.status(200).json({
      created: true,
      message: "Meditation created successfully",
      meditation: populatedMeditation,
    });
  } catch (err) {
    console.error("Error in adding meditation:", err);
    res.status(500).send(err);
  }
};

module.exports = {
  getOneMeditation,
  updateMeditation,
  deleteMeditation,
  addMeditation,
  getTodayMeditation,
  getAllMeditations,
};
