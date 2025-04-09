// logger.js
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize, errors } = format;

// 💅 Custom log format
const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// 🔥 Create logger
const logger = createLogger({
  level: "info", // change to 'debug' for more details
  format: combine(
    errors({ stack: true }), // Log stack trace for errors
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    customFormat,
  ),
  transports: [
    // 🌈 Colored console logs
    new transports.Console({
      format: combine(colorize(), customFormat),
    }),

    // 📁 Info logs to file
    new transports.File({ filename: "logs/info.log", level: "info" }),

    // ❌ Error logs to separate file
    new transports.File({ filename: "logs/error.log", level: "error" }),
  ],
  exitOnError: false,
});

module.exports = logger;
