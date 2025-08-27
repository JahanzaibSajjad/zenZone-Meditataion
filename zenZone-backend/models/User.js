const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  deviceId: {
    type: String,
    required: true,
  },
  firebaseToken: {
    type: String,
    required: true,
  },
  isTodaysMediationRead: {
    type: Boolean,
  },
});

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
