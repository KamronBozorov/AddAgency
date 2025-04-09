const express = require("express");
const {
  getAllOwners,
  getOwnerById,
  createOwner,
  updateOwner,
  deleteOwner,
  registerOwner,
  activateOwner,
  login,
  refreshToken,
  resetPassword,
} = require("../contollers/owners.controller");

const router = express.Router();

router.post("/register", registerOwner);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/reset-password", resetPassword);
router.post("/activate/:otp", activateOwner);

router.get("/", getAllOwners);
router.get("/:id", getOwnerById);
router.post("/", createOwner);
router.put("/:id", updateOwner);
router.delete("/:id", deleteOwner);

module.exports = router;
