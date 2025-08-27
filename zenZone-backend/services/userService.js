const UserModel = require("../models/User");

const getOneUser = async (condition) => {
  return new Promise((resolve, reject) => {
    UserModel.findOne(condition)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const updateMultiple = async (condition, data) => {
  return new Promise((resolve, reject) => {
    UserModel.updateMany(condition, data)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const updateUser = async (condition, data) => {
  return new Promise((resolve, reject) => {
    UserModel.findOneAndUpdate(condition, data, { new: true })
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const deleteUser = async (condition) => {
  return new Promise((resolve, reject) => {
    UserModel.deleteOne(condition)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const addUser = async (data) => {
  return new Promise((resolve, reject) => {
    new UserModel(data)
      .save()
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const getAllPaged = async (body) => {
  return new Promise((resolve, reject) => {
    UserModel.find()
      .limit(body?.take ? body?.take : 10)
      .skip(body?.skip ? body?.skip : 0)
      .then((users) => {
        UserModel.count().then((count) => {
          resolve({ count, users });
        });
      })
      .catch((err) => reject(err));
  });
};

module.exports = {
  getOneUser,
  updateUser,
  deleteUser,
  addUser,
  getAllPaged,
  updateMultiple,
};
