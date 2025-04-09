const Payment = require("../models/payments");
const asyncHandler = require("../helpers/async.hendler");
const successResponse = require("../helpers/success.response");
const PaymentStatus = require("../models/payment.statuses");
const PaymentMethod = require("../models/payment.methods");
const Contract = require("../models/contracts");

const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.findAll({
    include: [PaymentStatus, PaymentMethod, Contract],
  });
  successResponse(res, "Payments retrieved successfully", payments);
});

const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findByPk(req.params.id, {
    include: [PaymentStatus, PaymentMethod, Contract],
  });
  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }
  successResponse(res, "Payment retrieved successfully", payment);
});

const createPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.create(req.body);
  successResponse(res, "Payment created successfully", payment, 201);
});

const updatePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findByPk(req.params.id);
  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }
  await payment.update(req.body);
  successResponse(res, "Payment updated successfully", payment);
});

const deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findByPk(req.params.id);
  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }
  await payment.destroy();
  successResponse(res, "Payment deleted successfully", null, 204);
});

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
};

