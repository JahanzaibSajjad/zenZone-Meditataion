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

  if (body.search) {
    q.$or = [
      { title: { $regex: body.search, $options: "i" } },
      { description: { $regex: body.search, $options: "i" } },
    ];
  }

  if (body.date) {
    q.date = {
      $gte: `${body.date}-1`,
      $lte: moment([body.date.split("-")[0], body.date.split("-")[1] - 1])
        .endOf("month")
        .format("YYYY-MM-DD")
        .toString(),
    };
  }

  if (body.filter === "past") {
    q.date = { $lte: moment().utc().format("YYYY-MM-DD") };
  }

  // NEW: mood filter (accepts id or title)
  if (body.mood) {
    let moodId = null;
    if (/^[0-9a-fA-F]{24}$/.test(body.mood)) {
      moodId = body.mood;
    } else {
      const m = await Mood.findOne(
        { title: new RegExp(`^${body.mood}$`, "i") },
        "_id"
      );
      if (m) moodId = m._id;
    }
    if (moodId) q.moods = { $in: [moodId] };
  }

  return q;
};

const getAllMeditations = async (body) => {
  return new Promise((resolve, reject) => {
    const q = {
      ...(body.search && {
        $or: [
          { title: { $regex: body.search, $options: "i" } },
          { description: { $regex: body.search, $options: "i" } },
        ],
      }),
      ...(body.date && {
        date: {
          $gte: `${body.date}-1`,
          $lte: moment([body.date.split("-")[0], body.date.split("-")[1] - 1])
            .endOf("month")
            .format("YYYY-MM-DD")
            .toString(),
        },
      }),
      ...(body.filter === "past" && {
        date: { $lte: moment().utc().format("YYYY-MM-DD") },
      }),
    };

    // ✅ NEW: filter by mood string if provided
    if (body.mood) {
      q.moods = { $in: [new RegExp(`^${body.mood}$`, "i")] };
    }

    MeditationModel.find(q)
      .sort({ date: "descending" })
      .limit(body?.take ? body?.take : 10)
      .skip(body?.skip ? body?.skip : 0)
      .then((meditations) => {
        MeditationModel.countDocuments(q)
          .then((count) => resolve({ count, meditations }))
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
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
  return new Promise((resolve, reject) => {
    new MeditationModel(data)
      .save()
      .then((data) =>
        MeditationModel.findById(data._id)
          .populate("moods", "title")
          .then((d) => resolve(d))
      )
      .catch((err) => reject(err));
  });
};

module.exports = {
  getOneMeditation,
  updateMeditation,
  deleteMeditation,
  addMeditation,
  getAllMeditations,
};
