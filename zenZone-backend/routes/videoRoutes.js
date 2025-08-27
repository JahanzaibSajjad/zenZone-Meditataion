const videoController = require("../controllers/videoController");
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/:id", videoController.getOneVideo);

router.post("/", videoController.getAllVideos);

router.get("/", videoController.getAllVideosNonPaged);

router.put("/:id", authMiddleware.verifyAuth, videoController.updateVideo);

router.delete("/:id", authMiddleware.verifyAuth, videoController.deleteVideo);

router.post("/add", authMiddleware.verifyAuth, videoController.addVideo);

module.exports = router;
