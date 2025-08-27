const videoService = require("../services/videoService");

const getOneVideo = async (req, res) => {
  videoService
    .getOneVideo({
      _id: req.params.id,
    })
    .then((video) => res.status(200).send(video ? video : "Video not found"))
    .catch((err) => res.status(500).send(err));
};

const getAllVideos = async (req, res) => {
  videoService
    .getAllVideos(req.body)
    .then((videos) => res.status(200).send(videos))
    .catch((err) => res.status(500).send(err));
};

const getAllVideosNonPaged = async (req, res) => {
  videoService
    .getAllVideosNonPaged()
    .then((videos) => res.status(200).send(videos))
    .catch((err) => res.status(500).send(err));
};

const updateVideo = async (req, res) => {
  videoService
    .updateVideo(
      {
        _id: req.params.id,
      },
      req.body
    )
    .then((video) => res.status(200).send(video))
    .catch((err) => res.status(500).send(err));
};

const deleteVideo = async (req, res) => {
  videoService
    .deleteVideo({ _id: req.params.id })
    .then(() =>
      res.status(200).json({
        deleted: true,
        message: "Video is deleted!",
      })
    )
    .catch((err) => res.status(500).send(err));
};

const addVideo = async (req, res) => {
  videoService
    .addVideo(req.body)
    .then((video) => res.status(200).send(video))
    .catch((err) => res.status(500).send(err));
};

module.exports = {
  getOneVideo,
  updateVideo,
  deleteVideo,
  addVideo,
  getAllVideos,
  getAllVideosNonPaged,
};
