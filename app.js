const express = require("express");
const config = require("config");
const sequelize = require("./config/db.js");
const mainRoute = require("./routes/index.js");
const cookieParser = require("cookie-parser");
const errorHandler = require("./helpers/error.handler.js");
const logger = require("./config/logger.js");

const app = express();
const PORT = config.get("port");

app.use(express.json());
app.use(cookieParser());
app.use("/api", mainRoute);
app.use(errorHandler);

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Connection has been established successfully.");
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

start();
