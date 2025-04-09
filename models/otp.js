const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const OTP = sequelize.define("OTP", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_type: {
    type: DataTypes.ENUM('client', 'admin', 'owner'),
    allowNull: false
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false
  },
  exp_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  is_used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  tableName: 'otps'
});

module.exports = OTP;
