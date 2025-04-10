const errorHandler = require("../helpers/error.handler");
const { ForbiddenError } = require("../helpers/custom.error");

module.exports = function (req, res, next) {
  try {
    if (!req.creator || !req.creator.is_creator) {
      throw new ForbiddenError(
        "Admin must be a creator to access this resource",
      );
    }
    next();
  } catch (error) {
    errorHandler(error, res);
  }
};
