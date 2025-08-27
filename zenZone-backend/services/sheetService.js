const SheetModel = require("../models/Sheet");

const getOneSheet = async (condition) => {
  return new Promise((resolve, reject) => {
    SheetModel.findOne(condition)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const getAllSheets = async (body) => {
  return new Promise((resolve, reject) => {
    SheetModel.find(
      body.search && {
        $or: [
          { title: { $regex: body.search, $options: "i" } },
          { detail: { $regex: body.search, $options: "i" } },
        ],
      }
    )
      .limit(body?.take ? body?.take : 10)
      .skip(body?.skip ? body?.skip : 0)
      .then((sheets) => {
        SheetModel.count(
          body.search && {
            $or: [
              { title: { $regex: body.search, $options: "i" } },
              { detail: { $regex: body.search, $options: "i" } },
            ],
          }
        )
          .then((count) => {
            resolve({ count, sheets });
          })
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};

const getAllSheetsNonPaged = async () => {
  return new Promise((resolve, reject) => {
    SheetModel.find()
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const getSheetsByIDs = async (sheets) => {
  return new Promise((resolve, reject) => {
    SheetModel.find({ _id: { $in: sheets } })
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const updateSheet = async (condition, data) => {
  return new Promise((resolve, reject) => {
    SheetModel.findOneAndUpdate(condition, data, { new: true })
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const deleteSheet = async (condition) => {
  return new Promise((resolve, reject) => {
    SheetModel.deleteOne(condition)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const addSheet = async (data) => {
  return new Promise((resolve, reject) => {
    new SheetModel(data)
      .save()
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

module.exports = {
  getOneSheet,
  updateSheet,
  deleteSheet,
  addSheet,
  getSheetsByIDs,
  getAllSheets,
  getAllSheetsNonPaged,
};
