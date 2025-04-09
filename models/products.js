const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Owner = require("./owners");
const ProductStatus = require("./product.statuses");
const Category = require("./category");

const Product = sequelize.define(
  "Product",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
    tableName: "products",
  },
);

Owner.hasMany(Product);
Product.belongsTo(Owner);

ProductStatus.hasMany(Product);
Product.belongsTo(ProductStatus);

Category.hasMany(Product);
Product.belongsTo(Category);

module.exports = Product;
