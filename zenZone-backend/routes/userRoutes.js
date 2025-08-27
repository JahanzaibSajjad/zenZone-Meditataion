const userController = require("../controllers/userController");
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/:id", userController.getOneUser);

router.get("/device/:id", userController.getUserByDevice);

router.put("/:id", authMiddleware.verifyAuth, userController.updateUser);

router.put(
  "/device/:id",
  authMiddleware.verifyAuth,
  userController.updateUserByDevice
);

router.delete("/:id", authMiddleware.verifyAuth, userController.deleteUser);

router.delete(
  "/device/:id",
  authMiddleware.verifyAuth,
  userController.deleteUserByDevice
);

router.post("/add", userController.addUser);

router.get("/read-notification/:id", userController.notificationRead);

router.post("/send-email", userController.sendEmail);

module.exports = router;
