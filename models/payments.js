const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const PaymentMethod = require("./payment.methods");
const PaymentStatus = require("./payment.statuses");
const Contract = require("./contracts");

const Payment = sequelize.define(
  "Payment",
  {
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "payments",
  },
);

PaymentMethod.hasMany(Payment);
Payment.belongsTo(PaymentMethod);

PaymentStatus.hasMany(Payment);
Payment.belongsTo(PaymentStatus);

Contract.hasMany(Payment);
Payment.belongsTo(Contract);

module.exports = Payment;
