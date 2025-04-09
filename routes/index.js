const express = require("express");
const adminRoutes = require("./admin.routes");
const clientRoutes = require("./client.routes");
const productRoutes = require("./product.routes");
const contractRoutes = require("./contract.routes");
const paymentRoutes = require("./payment.routes");
const ownerRoutes = require("./owner.routes");
const categoryRoutes = require("./category.routes");
const otpRoutes = require("./otp.routes");
const passportDetailsRoutes = require("./passport.details.routes");
const paymentMethodRoutes = require("./payment.method.routes");
const paymentStatusRoutes = require("./payment.status.routes");
const contractStatusRoutes = require("./contract.status.routes");
const productStatusRoutes = require("./product.status.routes");

const router = express.Router();

router.use("/admins", adminRoutes);
router.use("/clients", clientRoutes);
router.use("/products", productRoutes);
router.use("/contracts", contractRoutes);
router.use("/payments", paymentRoutes);
router.use("/owners", ownerRoutes);
router.use("/categories", categoryRoutes);
router.use("/otps", otpRoutes);
router.use("/passport-details", passportDetailsRoutes);
router.use("/payment-methods", paymentMethodRoutes);
router.use("/payment-statuses", paymentStatusRoutes);
router.use("/contract-statuses", contractStatusRoutes);
router.use("/product-statuses", productStatusRoutes);

module.exports = router;
