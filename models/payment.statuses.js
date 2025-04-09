const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PaymentStatus = sequelize.define("PaymentStatus", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'payment_statuses'
});

module.exports = PaymentStatus;
