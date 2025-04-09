module.exports = successResponse = (res, message, data, statusCode = 200) => {
  res.status(statusCode).json({
    type: "Success",
    message,
    data,
  });
};
