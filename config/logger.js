// logger.js
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize, errors } = format;

const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(
    errors({ stack: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    customFormat,
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), customFormat),
    }),

    new transports.File({ filename: "logs/info.log", level: "info" }),

    new transports.File({ filename: "logs/error.log", level: "error" }),
  ],
  exitOnError: false,
});

module.exports = logger;
