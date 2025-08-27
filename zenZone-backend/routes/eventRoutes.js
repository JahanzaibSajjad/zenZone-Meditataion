const eventController = require("../controllers/eventController");
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/:id", eventController.getOneEvent);

router.post("/", eventController.getAllEvents);

router.get("/", eventController.getAllEventsNonPaged);

router.put("/:id", authMiddleware.verifyAuth, eventController.updateEvent);

router.delete("/:id", authMiddleware.verifyAuth, eventController.deleteEvent);

router.post("/add", authMiddleware.verifyAuth, eventController.addEvent);

module.exports = router;
