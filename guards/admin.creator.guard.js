const errorHandler = require("../helpers/error.handler");
const {
  ForbiddenError,
  UnauthorizedError,
} = require("../helpers/custom.error");
const jwtService = require("../services/jwt.service");

module.exports = function (req, res, next) {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        status: "error",
        message: "No refresh token provided",
      });
    }

    const decodedData = jwtService.validateRefreshToken(refreshToken);
    if (!decodedData) {
      return res.status(401).json({
        status: "error",
        message: "Invalid refresh token",
      });
    }

    // Check if user has admin or creator role
    if (decodedData.role !== "admin" && decodedData.role !== "creator") {
      return res.status(403).json({
        status: "error",
        message: "Access denied",
      });
    }

    // Store user data in request for later use
    req.user = decodedData;

    next();
  } catch (error) {
    errorHandler(error, res);
  }
};
