const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PaymentMethod = sequelize.define(
  "PaymentMethod",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "payment_methods",
  },
);

module.exports = PaymentMethod;
