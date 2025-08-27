// zenZone-backend/controllers/meditationController.js
const meditationService = require("../services/meditationService");
const Meditation = require("../models/Meditation"); // NEW
const Mood = require("../models/Mood"); // NEW
const moment = require("moment");

// GET /meditations/:id
const getOneMeditation = async (req, res) => {
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

    if (search) {
      // if text index exists
      q.$text = { $search: search };
      // (fallback if you prefer regex)
      // q.$or = [{ title: new RegExp(search, "i") }, { description: new RegExp(search, "i") }];
    }

    if (mood) {
      let moodId = null;
      // if looks like ObjectId, accept as id; otherwise resolve by title
      if (/^[0-9a-fA-F]{24}$/.test(mood)) {
        moodId = mood;
      } else {
        const m = await Mood.findOne(
          { title: new RegExp(`^${mood}$`, "i") },
          "_id"
        );
        if (m) moodId = m._id;
      }
      if (moodId) q.moods = { $in: [moodId] };
    }

    const [items, count] = await Promise.all([
      Meditation.find(q)
        .populate("moods", "title") // return mood titles
        .sort({ date: -1, createdAt: -1 })
        .skip(Number(skip))
        .limit(Number(take)),
      Meditation.countDocuments(q),
    ]);

    return res.status(200).json({ meditations: items, count });
  } catch (err) {
    return res.status(500).send(err);
  }
};

// GET /meditations  (today)
const getTodayMeditation = async (req, res) => {
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
    if (!req.body.date) return res.status(422).send("Date not provided");

    // ensure moods is an array if provided
    if (req.body.moods && !Array.isArray(req.body.moods)) {
      req.body.moods = [];
    }

    const alreadyExists = await meditationService.getOneMeditation({
      date: req.body.date,
    });
    if (alreadyExists) {
      return res.status(200).json({
        created: false,
        message: "Meditation already exists for the date",
      });
    }

    meditationService
      .addMeditation(req.body)
      .then(async (meditation) => {
        const populated = await Meditation.findById(meditation._id).populate(
          "moods",
          "title"
        );
        return res.status(200).json({
          created: true,
          message: "created successfully",
          meditation: populated,
        });
      })
      .catch((err) => res.status(500).send(err));
  } catch (err) {
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
