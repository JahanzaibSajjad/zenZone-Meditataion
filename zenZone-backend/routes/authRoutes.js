const authController = require("../controllers/authController");
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/login", authController.loginAdmin);

router.post("/refresh-token", authController.refreshToken);

router.post("/logout", authController.logout);

router.post(
  "/verify-login",
  authMiddleware.verifyAuth,
  authController.verifyLogin
);

router.post("/forgot-password", authController.forgotPassword);

router.post("/validate-reset-link", authController.validateResetLink);

router.post(
  "/change-password-with-link",
  authController.changePasswordWithLink
);

router.post(
  "/change-password",
  authMiddleware.verifyAuth,
  authController.changePassword
);

module.exports = router;
