const WebsiteModel = require("../models/Website");

const getOneWebsite = async (condition) => {
  return new Promise((resolve, reject) => {
    WebsiteModel.findOne(condition)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const getAllWebsites = async (body) => {
  return new Promise((resolve, reject) => {
    WebsiteModel.find(
      body.search && { title: { $regex: body.search, $options: "i" } }
    )
      .limit(body?.take ? body?.take : 10)
      .skip(body?.skip ? body?.skip : 0)
      .then((websites) => {
        WebsiteModel.count(
          body.search && { title: { $regex: body.search, $options: "i" } }
        )
          .then((count) => {
            resolve({ count, websites });
          })
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};

const getAllWebsitesNonPaged = async () => {
  return new Promise((resolve, reject) => {
    WebsiteModel.find()
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const updateWebsite = async (condition, data) => {
  return new Promise((resolve, reject) => {
    WebsiteModel.findOneAndUpdate(condition, data, { new: true })
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const deleteWebsite = async (condition) => {
  return new Promise((resolve, reject) => {
    WebsiteModel.deleteOne(condition)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const addWebsite = async (data) => {
  return new Promise((resolve, reject) => {
    new WebsiteModel(data)
      .save()
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

module.exports = {
  getOneWebsite,
  updateWebsite,
  deleteWebsite,
  addWebsite,
  getAllWebsites,
  getAllWebsitesNonPaged,
};
