const {
  pushNewMeditationNotification,
  pushNewMeditationData,
} = require("../services/notificationService");
const userService = require("../services/userService");
const adminService = require("../services/adminService");
const {
  getNutritionEmailContent,
  NUTRITION_EMAIL_SUBJECT,
} = require("../shared/constants");
const { sendMail } = require("../services/mailerService");

const getOneUser = async (req, res) => {
  userService
    .getOneUser({
      _id: req.params.id,
    })
    .then((user) =>
      res.status(200).send(user ? user : { message: "User not found" })
    )
    .catch((err) => res.status(500).send(err));
};

const getUserByDevice = async (req, res) => {
  userService
    .getOneUser({
      deviceId: req.params.id,
    })
    .then((user) =>
      res.status(200).send(user ? user : { message: "User not found" })
    )
    .catch((err) => res.status(500).send(err));
};

const updateUser = async (req, res) => {
  userService
    .updateUser(
      {
        _id: req.params.id,
      },
      req.body
    )
    .then((user) => res.status(200).send(user))
    .catch((err) => res.status(500).send(err));
};

const updateUserByDevice = async (req, res) => {
  userService
    .updateUser(
      {
        deviceId: req.params.id,
      },
      req.body
    )
    .then((user) => res.status(200).send(user))
    .catch((err) => res.status(500).send(err));
};

const deleteUser = async (req, res) => {
  userService
    .deleteUser({ _id: req.params.id })
    .then(() => res.status(200).send({ message: "User is deleted!" }))
    .catch((err) => res.status(500).send(err));
};

const deleteUserByDevice = async (req, res) => {
  userService
    .deleteUser({ deviceId: req.params.id })
    .then(() => res.status(200).send({ message: "User is deleted!" }))
    .catch((err) => res.status(500).send(err));
};

const addUser = async (req, res) => {
  userService
    .addUser(req.body)
    .then((user) => res.status(200).send(user))
    .catch((err) => res.status(500).send(err));
};

const testNotification = async (req, res) => {
  pushNewMeditationNotification();
  res.status(200).send("Started Sending Notifications");
};

const testSilentNotification = async (req, res) => {
  pushNewMeditationData();
  res.status(200).send("Started Sending Silent Notifications");
};

const notificationRead = async (req, res) => {
  userService
    .updateUser(
      { firebaseToken: req.params.id },
      { isTodaysMediationRead: true }
    )
    .then(() => res.status(200).json({ message: "Notification read Recorded" }))
    .catch((err) => res.status(500).send(err));
};

const sendEmail = async (req, res) => {
  try {
    const admins = await adminService.getAdmins({});
    const emails = admins.map((admin) => admin.email);
    await sendMail(
      emails,
      NUTRITION_EMAIL_SUBJECT,
      getNutritionEmailContent(req.body)
    );
    res.status(200);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};

module.exports = {
  getOneUser,
  updateUser,
  deleteUser,
  addUser,
  updateUserByDevice,
  getUserByDevice,
  deleteUserByDevice,
  testNotification,
  testSilentNotification,
  notificationRead,
  sendEmail,
};
