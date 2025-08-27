const podcastController = require("../controllers/podcastController");
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/:id", podcastController.getOnePodcast);

router.post("/", podcastController.getAllPodcasts);

router.get("/", podcastController.getAllPodcastsNonPaged);

router.put("/:id", authMiddleware.verifyAuth, podcastController.updatePodcast);

router.delete("/:id", authMiddleware.verifyAuth, podcastController.deletePodcast);

router.post("/add", authMiddleware.verifyAuth, podcastController.addPodcast);

module.exports = router;
