const cVideoService = require("../services/cVideoService");

const getCVideo = async (req, res) => {
  cVideoService
    .getCVideo()
    .then((cVideo) => res.status(200).send(cVideo))
    .catch((err) => res.status(500).send(err));
};

const updateCVideo = async (req, res) => {
  try {
    const cVid = await cVideoService.getCVideo();
    cVideoService
      .updateCVideo(
        {
          _id: cVid._id,
        },
        req.body
      )
      .then((cVideo) => res.status(200).send(cVideo))
      .catch((err) => res.status(500).send(err));
  } catch (err) {
    res.status(500).send(err);
  }
};

const addCVideo = async (req, res) => {
  cVideoService
    .addCVideo(req.body)
    .then((event) => res.status(200).send(event))
    .catch((err) => res.status(500).send(err));
};

module.exports = {
  updateCVideo,
  getCVideo,
  addCVideo,
};
