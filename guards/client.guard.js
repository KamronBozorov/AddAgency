const errorHandler = require("../helpers/error.handler");
const errorResponse = require("../helpers/error.response");
const jwtService = require("../services/jwt.service");

module.exports = function (req, res, next) {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken)
      return res.status(401).json({ type: "error", message: "Unauthorized" });

    const decodedData = jwtService.validateRefreshToken(refreshToken);
    req.client = decodedData;
    next();
  } catch (error) {
    errorHandler(error, res);
  }
};
