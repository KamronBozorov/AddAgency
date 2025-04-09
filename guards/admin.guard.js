const errorHandler = require("../helpers/error.handler");
const { UnauthorizedError } = require("../helpers/custom.error");
const jwtService = require("../services/jwt.service");

module.exports = function (req, res, next) {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new UnauthorizedError("No refresh token provided");
    }

    const decodedData = jwtService.validateRefreshToken(refreshToken);
    if (!decodedData) {
      throw new UnauthorizedError("Invalid refresh token");
    }
    
    req.admin = decodedData;
    next();
  } catch (error) {
    errorHandler(error, res);
  }
};
