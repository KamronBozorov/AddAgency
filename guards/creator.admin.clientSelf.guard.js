const errorHandler = require("../helpers/error.handler");
const {
  ForbiddenError,
  UnauthorizedError,
  NotFoundError,
} = require("../helpers/custom.error");
const jwtService = require("../services/jwt.service");
const Client = require("../models/clients");

module.exports = async function (req, res, next) {
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

    if (decodedData.role === "creator" || decodedData.role === "admin") {
      req.user = decodedData;
      return next();
    }

    if (decodedData.role === "client") {
      const client = await Client.findByPk(req.params.id);

      if (!client) {
        return res.status(404).json({
          status: "error",
          message: "Client was not found",
        });
      }

      if (decodedData.sub === client.id) {
        req.user = decodedData;
        return next();
      }
    }

    res.status(403).json({
      type: "Error",
      message: "Access denied",
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

