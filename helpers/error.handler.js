const { CustomError } = require("./custom.error");

module.exports = (err, req, res, next) => {
  console.log(err);
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      status: "error",
      message: "Validation error",
      errors: err.errors.map((e) => e.message),
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      status: "error",
      message: "Resource already exists",
      errors: err.errors.map((e) => e.message),
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
