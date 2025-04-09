const errorHandler = require("../helpers/error.handler");

module.exports = function (req, res, next) {
  try {
    const adminId = req.params.id;
    const currentAdmin = req.admin;

    if (currentAdmin.id === adminId) {
      return next();
    }

    if (currentAdmin.is_creator) {
      return next();
    }

    return res.status(403).json({
      status: "error",
      message: "You don't have permission to access this resource",
    });
  } catch (error) {
    errorHandler(error, res);
  }
};
