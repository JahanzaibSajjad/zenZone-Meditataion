const AdminModel = require("../models/Admin");

const getOneAdmin = async (condition) => {
  return new Promise((resolve, reject) => {
    AdminModel.findOne(condition)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const getAdmins = async (condition) => {
  return new Promise((resolve, reject) => {
    AdminModel.find(condition)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const updateAdmin = async (condition, data) => {
  return new Promise((resolve, reject) => {
    AdminModel.findOneAndUpdate(condition, data, { new: true })
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const deleteAdmin = async (condition) => {
  return new Promise((resolve, reject) => {
    AdminModel.deleteOne(condition)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const addAdmin = async (data) => {
  return new Promise((resolve, reject) => {
    new AdminModel(data)
      .save()
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

module.exports = {
  getOneAdmin,
  updateAdmin,
  deleteAdmin,
  addAdmin,
  getAdmins,
};
