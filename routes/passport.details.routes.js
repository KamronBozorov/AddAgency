const express = require("express");
const {
  getAllPassportDetails,
  getPassportDetailById,
  createPassportDetail,
  updatePassportDetail,
  deletePassportDetail,
} = require("../contollers/passport.details.controller");
const adminCreatorGuard = require("../guards/admin.creator.guard");
const adminCreatorClientSelfGuard = require("../guards/admin.creator.clientSelf.guard");

const router = express.Router();

router.get("/", adminCreatorGuard, getAllPassportDetails);
router.get("/:id", getPassportDetailById);
router.post("/", createPassportDetail);
router.put("/:id", updatePassportDetail);
router.delete("/:id", deletePassportDetail);

module.exports = router;
