const websiteController = require("../controllers/websiteController");
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/:id", websiteController.getOneWebsite);

router.post("/", websiteController.getAllWebsites);

router.get("/", websiteController.getAllWebsitesNonPaged);

router.put("/:id", authMiddleware.verifyAuth, websiteController.updateWebsite);

router.delete("/:id", authMiddleware.verifyAuth, websiteController.deleteWebsite);

router.post("/add", authMiddleware.verifyAuth, websiteController.addWebsite);

module.exports = router;
