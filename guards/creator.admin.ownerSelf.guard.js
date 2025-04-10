const errorHandler = require("../helpers/error.handler");
const jwtService = require("../services/jwt.service");
const Owner = require("../models/owners");

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

    if (decodedData.role === "owner") {
      const owner = await Owner.findByPk(req.params.id);

      if (!owner) {
        return res.status(404).json({
          status: "error",
          message: "Owner was not found",
        });
      }

      if (decodedData.sub === owner.id) {
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

