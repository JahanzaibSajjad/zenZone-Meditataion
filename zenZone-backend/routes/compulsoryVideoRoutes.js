const cVideoController = require("../controllers/cVideoController");
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", cVideoController.getCVideo);

router.put("/", authMiddleware.verifyAuth, cVideoController.updateCVideo);

module.exports = router;
