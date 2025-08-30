const meditationController = require("../controllers/meditationController");
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/:id", meditationController.getOneMeditation);

router.post("/", meditationController.getAllMeditations);

router.get("/", meditationController.getAllMeditations);

router.get("/today", meditationController.getTodayMeditation);

router.put(
  "/:id",
  authMiddleware.verifyAuth,
  meditationController.updateMeditation
);

router.delete(
  "/:id",
  authMiddleware.verifyAuth,
  meditationController.deleteMeditation
);

router.post(
  "/add",
  authMiddleware.verifyAuth,
  meditationController.addMeditation
);

module.exports = router;
