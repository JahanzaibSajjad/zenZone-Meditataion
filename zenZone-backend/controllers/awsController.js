const awsService = require("../services/awsService");

const getSignedURL = (req, res) => {
  awsService
    .getSignedURL(req?.body?.key ? req.body.key : "")
    .then((data) => res.status(200).send(data))
    .catch((err) => console.log(err));
};

module.exports = {
  getSignedURL,
};
