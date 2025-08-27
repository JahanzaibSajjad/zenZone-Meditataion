const VideoModel = require("../models/Video");

const getOneVideo = async (condition) => {
  return new Promise((resolve, reject) => {
    VideoModel.findOne(condition)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const getAllVideos = async (body) => {
  return new Promise((resolve, reject) => {
    VideoModel.find(
      body.search && { description: { $regex: body.search, $options: "i" } }
    )
      .limit(body?.take ? body?.take : 10)
      .skip(body?.skip ? body?.skip : 0)
      .then((videos) => {
        VideoModel.count(
          body.search && { description: { $regex: body.search, $options: "i" } }
        )
          .then((count) => {
            resolve({ count, videos });
          })
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};

const getAllVideosNonPaged = async () => {
  return new Promise((resolve, reject) => {
    VideoModel.find()
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const updateVideo = async (condition, data) => {
  return new Promise((resolve, reject) => {
    VideoModel.findOneAndUpdate(condition, data, { new: true })
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const deleteVideo = async (condition) => {
  return new Promise((resolve, reject) => {
    VideoModel.deleteOne(condition)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const addVideo = async (data) => {
  return new Promise((resolve, reject) => {
    new VideoModel(data)
      .save()
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

module.exports = {
  getOneVideo,
  updateVideo,
  deleteVideo,
  addVideo,
  getAllVideos,
  getAllVideosNonPaged,
};
