module.exports = errorResponse = (res, message, statusCode = 400) => {
  res.status(statusCode).json({
    type: "Error",
    message,
  });

  return false;
};
