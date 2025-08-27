const jwtService = require("../services/jwtService");
const adminService = require("../services/adminService");
const mailerService = require("../services/mailerService");
const { forgetPassSubject, forgetPassText } = require("../shared/constants");

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).send("Email or password incorrect!");
    }
    let admin = await adminService.getOneAdmin({
      email,
      password,
    });
    if (admin) {
      const accessToken = jwtService.generateAccessToken(admin);
      const refreshToken = jwtService.generateRefreshToken(admin);
      await adminService.updateAdmin(
        { _id: admin._id },
        { $push: { refreshToken } }
      );
      res.status(200).json({
        email: admin.email,
        accessToken,
        refreshToken,
      });
    } else {
      return res.status(401).send("Email or password incorrect!");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

const verifyLogin = async (req, res) => {
  res.status(200).json("Valid Credentials");
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.body.token;

    if (!refreshToken)
      return res.status(401).json("You are not authenticated!");
    const adminWithToken = await adminService.getOneAdmin({
      refreshToken,
    });
    if (!adminWithToken) {
      return res.status(403).json("Refresh token is not valid!");
    }
    jwtService.verifyToken(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_KEY,
      async (err, admin) => {
        err && console.log(err);

        const newAccessToken = jwtService.generateAccessToken(admin);
        const newRefreshToken = jwtService.generateRefreshToken(admin);

        await adminService.updateAdmin(
          { _id: adminWithToken._id },
          { $pull: { refreshToken } }
        );

        await adminService.updateAdmin(
          { _id: adminWithToken._id },
          { $push: { refreshToken: newRefreshToken } }
        );

        res.status(200).json({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      }
    );
  } catch (err) {
    res.status(500).send(err);
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.body.token;
    await adminService.updateAdmin(
      { refreshToken },
      { $pull: { refreshToken } }
    );
    res.status(200).json("You logged out successfully.");
  } catch (err) {
    res.status(500).send(err);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const admin = await adminService.getOneAdmin({ email: req.body?.email });
    if (!admin) {
      return res
        .status(200)
        .json({ success: false, message: "User not Registered" });
    }
    const passwordResetLink = jwtService.generateToken(admin);
    await adminService.updateAdmin(
      { email: req.body.email },
      { passwordResetLink }
    );
    await mailerService.sendMail(
      req.body.email,
      forgetPassSubject,
      forgetPassText(passwordResetLink)
    );
    return res
      .status(200)
      .json({ success: true, message: "Email sent to User" });
  } catch (err) {
    res.status(500).send(err);
  }
};

const validateResetLink = async (req, res) => {
  try {
    jwtService.verifyToken(
      req.body.link,
      process.env.JWT_TOKEN_KEY,
      async (err, admin) => {
        if (err) {
          return res
            .status(200)
            .json({ valid: false, message: "Link not Valid" });
        }
        const adminRecord = await adminService.getOneAdmin({ _id: admin._id });
        if (adminRecord.passwordResetLink === req.body.link) {
          return res.status(200).json({ valid: true, message: "Valid Link" });
        } else {
          return res
            .status(200)
            .json({ valid: false, message: "Link not Valid" });
        }
      }
    );
  } catch (err) {
    res.status(500).send(err);
  }
};

const changePasswordWithLink = async (req, res) => {
  try {
    jwtService.verifyToken(
      req.body.link,
      process.env.JWT_TOKEN_KEY,
      async (err, admin) => {
        if (err) {
          return res
            .status(200)
            .json({ success: false, message: "Link not Valid" });
        }
        const adminRecord = await adminService.getOneAdmin({ _id: admin._id });
        if (adminRecord.passwordResetLink === req.body.link) {
          await adminService.updateAdmin(
            { _id: admin._id },
            { password: req.body.password, passwordResetLink: "" }
          );
          return res
            .status(200)
            .json({ success: true, message: "Password Updated" });
        } else {
          return res
            .status(200)
            .json({ success: false, message: "Link not Valid" });
        }
      }
    );
  } catch (err) {
    res.status(500).send(err);
  }
};

const changePassword = async (req, res) => {
  try {
    const admin = await adminService.getOneAdmin({ _id: req.user._id });
    if (admin.password === req.body?.oldPass) {
      await adminService.updateAdmin(
        { _id: admin._id },
        { password: req.body.newPass }
      );
      return res
        .status(200)
        .json({ success: true, message: "Password Updated" });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "Old Password not correct" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  loginAdmin,
  refreshToken,
  logout,
  verifyLogin,
  forgotPassword,
  validateResetLink,
  changePasswordWithLink,
  changePassword,
};
