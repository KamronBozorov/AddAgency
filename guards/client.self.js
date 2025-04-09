const errorHandler = require("../helpers/error.handler");
const errorResponse = require("../helpers/error.response");
const jwtService = require("../services/jwt.service");

module.exports = function (req, res, next) {
  try {
    const { sub } = req.client;

    if (+sub !== +req.params.id)
      return res.status(403).json({
        type: "Error",
        message: "IDs not matched",
      });

    next();
  } catch (error) {
    errorHandler(error, res);
  }
};
