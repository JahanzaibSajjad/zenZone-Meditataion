const awsController = require("../controllers/awsController");
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/get-url", authMiddleware.verifyAuth, awsController.getSignedURL);

module.exports = router;
