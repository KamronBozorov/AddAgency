const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ContractStatuses = sequelize.define("ProductStatuses", {
  status_name: {
    type: DataTypes.STRING,
  },
});

module.exports = ContractStatuses;
