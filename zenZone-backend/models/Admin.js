const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: [{ type: String }],
  passwordResetLink: {
    type: String,
  },
});

const AdminModel = mongoose.model("admin", adminSchema);
module.exports = AdminModel;
