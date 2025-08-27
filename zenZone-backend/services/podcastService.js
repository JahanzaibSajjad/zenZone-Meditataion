const PodcastModel = require("../models/Podcast");

const getOnePodcast = async (condition) => {
  return new Promise((resolve, reject) => {
    PodcastModel.findOne(condition)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const getAllPodcasts = async (body) => {
  return new Promise((resolve, reject) => {
    PodcastModel.find(
      body.search && { title: { $regex: body.search, $options: "i" } }
    )
      .limit(body?.take ? body?.take : 10)
      .skip(body?.skip ? body?.skip : 0)
      .then((podcasts) => {
        PodcastModel.count(
          body.search && { title: { $regex: body.search, $options: "i" } }
        )
          .then((count) => {
            resolve({ count, podcasts });
          })
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};

const getAllPodcastsNonPaged = async () => {
  return new Promise((resolve, reject) => {
    PodcastModel.find()
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const updatePodcast = async (condition, data) => {
  return new Promise((resolve, reject) => {
    PodcastModel.findOneAndUpdate(condition, data, { new: true })
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const deletePodcast = async (condition) => {
  return new Promise((resolve, reject) => {
    PodcastModel.deleteOne(condition)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const addPodcast = async (data) => {
  return new Promise((resolve, reject) => {
    new PodcastModel(data)
      .save()
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

module.exports = {
  getOnePodcast,
  updatePodcast,
  deletePodcast,
  addPodcast,
  getAllPodcasts,
  getAllPodcastsNonPaged,
};
