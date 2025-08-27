const websiteService = require("../services/websiteService");

const getOneWebsite = async (req, res) => {
  websiteService
    .getOneWebsite({
      _id: req.params.id,
    })
    .then((website) => res.status(200).send(website ? website : "Website not found"))
    .catch((err) => res.status(500).send(err));
};

const getAllWebsites = async (req, res) => {
  websiteService
    .getAllWebsites(req.body)
    .then((websites) => res.status(200).send(websites))
    .catch((err) => res.status(500).send(err));
};

const getAllWebsitesNonPaged = async (req, res) => {
  websiteService
    .getAllWebsitesNonPaged()
    .then((websites) => res.status(200).send(websites))
    .catch((err) => res.status(500).send(err));
};

const updateWebsite = async (req, res) => {
  websiteService
    .updateWebsite(
      {
        _id: req.params.id,
      },
      req.body
    )
    .then((website) => res.status(200).send(website))
    .catch((err) => res.status(500).send(err));
};

const deleteWebsite = async (req, res) => {
  websiteService
    .deleteWebsite({ _id: req.params.id })
    .then(() =>
      res.status(200).json({
        deleted: true,
        message: "Website is deleted!",
      })
    )
    .catch((err) => res.status(500).send(err));
};

const addWebsite = async (req, res) => {
  websiteService
    .addWebsite(req.body)
    .then((website) => res.status(200).send(website))
    .catch((err) => res.status(500).send(err));
};

module.exports = {
  getOneWebsite,
  updateWebsite,
  deleteWebsite,
  addWebsite,
  getAllWebsites,
  getAllWebsitesNonPaged,
};
