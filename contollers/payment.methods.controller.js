const PaymentMethod = require("../models/payment.methods");
const asyncHandler = require("../helpers/async.hendler");
const successResponse = require("../helpers/success.response");
const Payment = require("../models/payments");

const getAllPaymentMethods = asyncHandler(async (req, res) => {
  const paymentMethods = await PaymentMethod.findAll({ include: [Payment] });
  successResponse(
    res,
    "Payment methods retrieved successfully",
    paymentMethods,
  );
});

const getPaymentMethodById = asyncHandler(async (req, res) => {
  const paymentMethod = await PaymentMethod.findByPk(req.params.id, {
    include: [Payment],
  });
  if (!paymentMethod) {
    return res.status(404).json({ message: "Payment method not found" });
  }
  successResponse(res, "Payment method retrieved successfully", paymentMethod);
});

const createPaymentMethod = asyncHandler(async (req, res) => {
  const paymentMethod = await PaymentMethod.create(req.body);
  successResponse(
    res,
    "Payment method created successfully",
    paymentMethod,
    201,
  );
});

const updatePaymentMethod = asyncHandler(async (req, res) => {
  const paymentMethod = await PaymentMethod.findByPk(req.params.id);
  if (!paymentMethod) {
    return res.status(404).json({ message: "Payment method not found" });
  }
  await paymentMethod.update(req.body);
  successResponse(res, "Payment method updated successfully", paymentMethod);
});

const deletePaymentMethod = asyncHandler(async (req, res) => {
  const paymentMethod = await PaymentMethod.findByPk(req.params.id);
  if (!paymentMethod) {
    return res.status(404).json({ message: "Payment method not found" });
  }
  await paymentMethod.destroy();
  successResponse(res, "Payment method deleted successfully", null, 204);
});

module.exports = {
  getAllPaymentMethods,
  getPaymentMethodById,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
};

