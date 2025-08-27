const moodController = require("../controllers/moodController");
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/:id", moodController.getOneMood);

router.post("/", moodController.getAllMoods);

router.get("/", moodController.getAllMoodsNonPaged);

router.put("/:id", authMiddleware.verifyAuth, moodController.updateMood);

router.delete("/:id", authMiddleware.verifyAuth, moodController.deleteMood);

router.post("/add", authMiddleware.verifyAuth, moodController.addMood);

module.exports = router;
