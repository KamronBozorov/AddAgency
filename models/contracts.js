const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Owner = require("./owners");
const Client = require("./clients");
const Product = require("./products");
const ContractStatuses = require("./contract.statuses");

const Contract = sequelize.define(
  "Contract",
  {
    contract_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    sum: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    is_product_brokem: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "contracts",
    underscored: true, // Use snake_case for DB column names
  },
);

Owner.hasMany(Contract);
Contract.belongsTo(Owner);

Client.hasMany(Contract);

Contract.belongsTo(Client);

Product.hasMany(Contract);

Contract.belongsTo(Product);

ContractStatuses.hasMany(Contract);

Contract.belongsTo(ContractStatuses);

module.exports = Contract;
