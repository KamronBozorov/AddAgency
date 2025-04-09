const PaymentStatus = require("../models/payment.statuses");
const asyncHandler = require("../helpers/async.hendler");
const successResponse = require("../helpers/success.response");
const Payment = require("../models/payments");

const getAllPaymentStatuses = asyncHandler(async (req, res) => {
  const paymentStatuses = await PaymentStatus.findAll({ include: [Payment] });
  successResponse(
    res,
    "Payment statuses retrieved successfully",
    paymentStatuses,
  );
});

const getPaymentStatusById = asyncHandler(async (req, res) => {
  const paymentStatus = await PaymentStatus.findByPk(req.params.id, {
    include: [Payment],
  });
  if (!paymentStatus) {
    return res.status(404).json({ message: "Payment status not found" });
  }
  successResponse(res, "Payment status retrieved successfully", paymentStatus);
});

const createPaymentStatus = asyncHandler(async (req, res) => {
  const paymentStatus = await PaymentStatus.create(req.body);
  successResponse(
    res,
    "Payment status created successfully",
    paymentStatus,
    201,
  );
});

const updatePaymentStatus = asyncHandler(async (req, res) => {
  const paymentStatus = await PaymentStatus.findByPk(req.params.id);
  if (!paymentStatus) {
    return res.status(404).json({ message: "Payment status not found" });
  }
  await paymentStatus.update(req.body);
  successResponse(res, "Payment status updated successfully", paymentStatus);
});

const deletePaymentStatus = asyncHandler(async (req, res) => {
  const paymentStatus = await PaymentStatus.findByPk(req.params.id);
  if (!paymentStatus) {
    return res.status(404).json({ message: "Payment status not found" });
  }
  await paymentStatus.destroy();
  successResponse(res, "Payment status deleted successfully", null, 204);
});

module.exports = {
  getAllPaymentStatuses,
  getPaymentStatusById,
  createPaymentStatus,
  updatePaymentStatus,
  deletePaymentStatus,
};

