const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PassportDetail = sequelize.define(
  "PassportDetail",
  {
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "passport_details",
  },
);

module.exports = PassportDetail;
