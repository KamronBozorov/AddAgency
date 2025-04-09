const errorHandler = require("../helpers/error.handler");
const {
  ForbiddenError,
  UnauthorizedError,
} = require("../helpers/custom.error");
const jwtService = require("../services/jwt.service");
const PassportDetail = require("../models/pasport.details");

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

    const passport = await PassportDetail.findByPk(req.params.id);

    console.log(+decodedData.sub === +passport.client_id);
    if (+decodedData.sub == +passport.client_id) {
      req.user = decodedData;

      next();
    }

    res.status(403).json({
      status: "error",
      message: "Access denied",
    });
  } catch (error) {
    errorHandler(error, res);
  }
};
