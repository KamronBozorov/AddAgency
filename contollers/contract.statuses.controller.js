const ContractStatus = require("../models/contract.statuses");
const asyncHandler = require("../helpers/async.hendler");
const successResponse = require("../helpers/success.response");
const Contract = require("../models/contracts");

const getAllContractStatuses = asyncHandler(async (req, res) => {
  const contractStatuses = await ContractStatus.findAll({
    include: [Contract],
  });
  successResponse(
    res,
    "Contract statuses retrieved successfully",
    contractStatuses,
  );
});

const getContractStatusById = asyncHandler(async (req, res) => {
  const contractStatus = await ContractStatus.findByPk(req.params.id, {
    include: [Contract],
  });
  if (!contractStatus) {
    return res.status(404).json({ message: "Contract status not found" });
  }
  successResponse(
    res,
    "Contract status retrieved successfully",
    contractStatus,
  );
});

const createContractStatus = asyncHandler(async (req, res) => {
  const contractStatus = await ContractStatus.create(req.body);
  successResponse(
    res,
    "Contract status created successfully",
    contractStatus,
    201,
  );
});

const updateContractStatus = asyncHandler(async (req, res) => {
  const contractStatus = await ContractStatus.findByPk(req.params.id);
  if (!contractStatus) {
    return res.status(404).json({ message: "Contract status not found" });
  }
  await contractStatus.update(req.body);
  successResponse(res, "Contract status updated successfully", contractStatus);
});

const deleteContractStatus = asyncHandler(async (req, res) => {
  const contractStatus = await ContractStatus.findByPk(req.params.id);
  if (!contractStatus) {
    return res.status(404).json({ message: "Contract status not found" });
  }
  await contractStatus.destroy();
  successResponse(res, "Contract status deleted successfully", null, 204);
});

module.exports = {
  getAllContractStatuses,
  getContractStatusById,
  createContractStatus,
  updateContractStatus,
  deleteContractStatus,
};

