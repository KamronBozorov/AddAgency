const express = require("express");
const {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
  getContractByDate,
  canceledContracts,
  brokenProducts,
} = require("../contollers/contracts.controller");
const adminGuard = require("../guards/admin.guard");
const adminCreatorGuard = require("../guards/admin.creator.guard");

const router = express.Router();

router.get("/ws/date", adminCreatorGuard, getContractByDate);
router.get("/ws/calceled-contracts", adminCreatorGuard, canceledContracts);
router.get("/ws/broken-products", adminCreatorGuard, brokenProducts);
router.get("/", adminCreatorGuard, getAllContracts);
router.get("/:id", getContractById);
router.post("/", createContract);
router.put("/:id", adminCreatorGuard, updateContract);
router.delete("/:id", adminCreatorGuard, deleteContract);

module.exports = router;
