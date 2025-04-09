const { Sequelize } = require("sequelize");
const config = require("config");

const sequelize = new Sequelize(
  `postgres://${config.get("db_username")}:${config.get("db_password")}@${config.get("db_host")}:${config.get("db_port")}/${config.get("db_name")}`,

  {
    logging: false,
  },
);

module.exports = sequelize;
