const CompulsoryVideoModel = require("../models/CompulsoryVideo");

const getCVideo = async () => {
  return new Promise((resolve, reject) => {
    CompulsoryVideoModel.find()
      .then((data) => resolve(data[0]))
      .catch((err) => reject(err));
  });
};

const updateCVideo = async (condition, data) => {
  return new Promise((resolve, reject) => {
    CompulsoryVideoModel.findOneAndUpdate(condition, data, { new: true })
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const addCVideo = async (data) => {
  return new Promise((resolve, reject) => {
    new CompulsoryVideoModel(data)
      .save()
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

module.exports = {
  updateCVideo,
  getCVideo,
  addCVideo
};
