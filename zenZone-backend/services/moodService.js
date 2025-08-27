const MoodModel = require("../models/Mood");

const getOneMood = async (condition) => {
  return new Promise((resolve, reject) => {
    MoodModel.findOne(condition)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const getSheetsByMoods = async (moods) => {
  return new Promise((resolve, reject) => {
    MoodModel.find({ _id: { $in: moods } })
      .distinct("sheet")
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const getMoodsBySheets = async (sheet) => {
  return new Promise((resolve, reject) => {
    MoodModel.find({ sheet })
      .populate("sheet")
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const getAllMoods = async (body) => {
  return new Promise((resolve, reject) => {
    MoodModel.find({
      ...(body.search && { title: { $regex: body.search, $options: "i" } }),
      ...(body.sheet && { sheet: body.sheet }),
    })
      .limit(body?.take ? body?.take : 10)
      .skip(body?.skip ? body?.skip : 0)
      .populate("sheet")
      .then((moods) => {
        MoodModel.count({
          ...(body.search && { title: { $regex: body.search, $options: "i" } }),
          ...(body.sheet && { sheet: body.sheet }),
        })
          .then((count) => {
            resolve({ count, moods });
          })
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};

const updateMood = async (condition, data) => {
  return new Promise((resolve, reject) => {
    MoodModel.findOneAndUpdate(condition, data, { new: true })
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const deleteMood = async (condition) => {
  return new Promise((resolve, reject) => {
    MoodModel.deleteOne(condition)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const addMood = async (data) => {
  return new Promise((resolve, reject) => {
    new MoodModel(data)
      .save()
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const getAllMoodsNonPaged = async () => {
  return new Promise((resolve, reject) => {
    MoodModel.find()
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

module.exports = {
  getOneMood,
  updateMood,
  deleteMood,
  addMood,
  getAllMoods,
  getSheetsByMoods,
  getMoodsBySheets,
  getAllMoodsNonPaged,
};
