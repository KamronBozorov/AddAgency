const Product = require("../models/products");
const asyncHandler = require("../helpers/async.hendler");
const successResponse = require("../helpers/success.response");
const Contract = require("../models/contracts");
const Owner = require("../models/owners");
const Category = require("../models/category");
const ProductStatus = require("../models/product.statuses");

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.findAll({
    include: [Contract, Owner, Category, ProductStatus],
  });
  successResponse(res, "Products retrieved successfully", products);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id, {
    include: [Contract, Owner, Category, ProductStatus],
  });
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  successResponse(res, "Product retrieved successfully", product);
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  successResponse(res, "Product created successfully", product, 201);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  await product.update(req.body);
  successResponse(res, "Product updated successfully", product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  await product.destroy();
  successResponse(res, "Product deleted successfully", null, 204);
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

