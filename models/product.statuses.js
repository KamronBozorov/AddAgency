const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProductStatus = sequelize.define("ProductStatus", {
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
  tableName: 'product_statuses'
});

module.exports = ProductStatus;
