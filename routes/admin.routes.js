const express = require("express");
const {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  registerAdmin,
  login,
  refreshToken,
  ownerLogin,
} = require("../contollers/admins.controller");
const isCreatorGuard = require("../guards/is.creator.guard");
const creatorGuard = require("../guards/creator.guard");
const adminSelf = require("../guards/admin.self");
const adminGuard = require("../guards/admin.guard");

const router = express.Router();

router.post("/login-owner", ownerLogin);
router.post("/login", login);
router.post("/refresh", refreshToken);

router.post("/register", creatorGuard, isCreatorGuard, registerAdmin);
router.post("/", creatorGuard, isCreatorGuard, createAdmin);
router.delete("/:id", creatorGuard, isCreatorGuard, deleteAdmin);
router.get("/superadmin", creatorGuard, isCreatorGuard, getAllAdmins);
router.get("/superadmin/:id", creatorGuard, isCreatorGuard, getAdminById);

router.get("/:id", adminGuard, adminSelf, getAdminById);
router.put("/:id", adminGuard, adminSelf, updateAdmin);

module.exports = router;
