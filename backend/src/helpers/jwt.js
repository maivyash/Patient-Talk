const jwt = require("jsonwebtoken");

function signToken(payload) {
  const secret = process.env.JWT_SECRET || "dev_jwt_secret_change_me";
  const expiresIn = process.env.JWT_EXPIRES_IN || "1d";

  return jwt.sign(payload, secret, { expiresIn });
}

function verifyToken(token) {
  const secret = process.env.JWT_SECRET || "dev_jwt_secret_change_me";
  return jwt.verify(token, secret);
}

module.exports = {
  signToken,
  verifyToken,
};

