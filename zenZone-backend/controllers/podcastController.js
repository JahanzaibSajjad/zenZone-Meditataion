const podcastService = require("../services/podcastService");

const getOnePodcast = async (req, res) => {
  podcastService
    .getOnePodcast({
      _id: req.params.id,
    })
    .then((podcast) => res.status(200).send(podcast ? podcast : "Podcast not found"))
    .catch((err) => res.status(500).send(err));
};

const getAllPodcasts = async (req, res) => {
  podcastService
    .getAllPodcasts(req.body)
    .then((podcasts) => res.status(200).send(podcasts))
    .catch((err) => res.status(500).send(err));
};

const getAllPodcastsNonPaged = async (req, res) => {
  podcastService
    .getAllPodcastsNonPaged()
    .then((podcasts) => res.status(200).send(podcasts))
    .catch((err) => res.status(500).send(err));
};

const updatePodcast = async (req, res) => {
  podcastService
    .updatePodcast(
      {
        _id: req.params.id,
      },
      req.body
    )
    .then((podcast) => res.status(200).send(podcast))
    .catch((err) => res.status(500).send(err));
};

const deletePodcast = async (req, res) => {
  podcastService
    .deletePodcast({ _id: req.params.id })
    .then(() =>
      res.status(200).json({
        deleted: true,
        message: "Podcast is deleted!",
      })
    )
    .catch((err) => res.status(500).send(err));
};

const addPodcast = async (req, res) => {
  podcastService
    .addPodcast(req.body)
    .then((podcast) => res.status(200).send(podcast))
    .catch((err) => res.status(500).send(err));
};

module.exports = {
  getOnePodcast,
  updatePodcast,
  deletePodcast,
  addPodcast,
  getAllPodcasts,
  getAllPodcastsNonPaged,
};
