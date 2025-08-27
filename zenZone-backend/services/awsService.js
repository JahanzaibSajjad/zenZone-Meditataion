const aws = require("aws-sdk");
const s3 = new aws.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  signatureVersion: "v4",
});

const getSignedURL = async (key) => {
  try {
    const fileName = new Date().valueOf();
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: key ? key : fileName.toString(),
      Expires: 60,
    };
    const uploadURL = await s3.getSignedUrlPromise("putObject", params);
    return uploadURL;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getSignedURL,
};
