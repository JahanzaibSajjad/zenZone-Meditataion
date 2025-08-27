const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_TOKEN_KEY,
    {
      expiresIn: process.env.TOKEN_EXPIRATION_TIME,
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_REFRESH_TOKEN_KEY
  );
};

const verifyToken = (token, key, callback) => {
  jwt.verify(token, key, (err, user) => callback(err, user));
};

const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_TOKEN_KEY
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  generateToken,
};
