const express = require("express");
const {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  registerClient,
  activateClient,
  login,
  refreshToken,
  resetPassword,
  paidProducts,
} = require("../contollers/clients.controller");
const adminCreatorGuard = require("../guards/admin.creator.guard");

const router = express.Router();

router.post("/ws/paid-products", adminCreatorGuard, paidProducts);
router.post("/register", registerClient);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/reset-password", resetPassword);
router.get("/activate/:otp", activateClient);

router.get("/", getAllClients);
router.get("/:id", getClientById);
router.post("/", createClient);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

module.exports = router;
