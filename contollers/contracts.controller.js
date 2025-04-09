const Contract = require("../models/contracts");
const asyncHandler = require("../helpers/async.hendler");
const successResponse = require("../helpers/success.response");
const Client = require("../models/clients");
const Product = require("../models/products");
const ContractStatuses = require("../models/contract.statuses");
const Owner = require("../models/owners");
const { Op } = require("sequelize");
const sequelize = require("../config/db");
const Category = require("../models/category");

const getAllContracts = asyncHandler(async (req, res) => {
  const contracts = await Contract.findAll({
    include: [Client, Product, ContractStatuses, Owner],
  });
  successResponse(res, "Contracts retrieved successfully", contracts);
});

const getContractById = asyncHandler(async (req, res) => {
  const contract = await Contract.findByPk(req.params.id);
  if (!contract) {
    return res.status(404).json({ message: "Contract not found" });
  }
  successResponse(res, "Contract retrieved successfully", contract);
});

const createContract = asyncHandler(async (req, res) => {
  try {
    const contract = await Contract.create(req.body);

    const createdContract = await Contract.findByPk(contract.id);

    successResponse(res, "Contract created successfully", createdContract, 201);
  } catch (error) {
    console.error("Contract creation error details:", error);

    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        status: "error",
        message:
          "One of the referenced IDs (client_id, product_id, contract_status_id, or owner_id) doesn't exist",
      });
    }

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        status: "error",
        message: "Validation error",
        errors: error.errors.map((e) => e.message),
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Error creating contract",
      error: error.message,
    });
  }
});

const updateContract = asyncHandler(async (req, res) => {
  const contract = await Contract.findByPk(req.params.id);
  if (!contract) {
    return res.status(404).json({ message: "Contract not found" });
  }
  await contract.update(req.body);

  const updatedContract = await Contract.findByPk(contract.id, {
    include: ["client", "product", "contract_status", "owner"],
  });

  successResponse(res, "Contract updated successfully", updatedContract);
});

const deleteContract = asyncHandler(async (req, res) => {
  const contract = await Contract.findByPk(req.params.id);
  if (!contract) {
    return res.status(404).json({ message: "Contract not found" });
  }
  await contract.destroy();
  successResponse(res, "Contract deleted successfully", null, 204);
});

const getContractByDate = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Start date and end date are required" });
  }

  const contracts = await Contract.findAll({
    where: {
      createdAt: {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      },
    },
    include: [Client, Product, ContractStatuses, Owner],
  });

  successResponse(res, "Contracts retrieved successfully", contracts);
});

const canceledContracts = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Start date and end date are required" });
  }

  const contracts = await Contract.findAll({
    where: {
      createdAt: {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      },
      ProductStatusId: 2,
    },
    include: [Client, Product, ContractStatuses, Owner],
  });

  successResponse(res, "Contracts retrieved successfully", contracts);
});

const brokenProducts = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Start date and end date are required" });
  }

  const contracts = await Contract.findAll({
    where: {
      is_product_brokem: true,
    },
    include: [Client, Product, ContractStatuses, Owner],
  });

  successResponse(res, "Contracts retrieved successfully", contracts);
});

module.exports = {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
  getContractByDate,
  canceledContracts,
  brokenProducts,
};
