const ProductStatus = require('../models/product.statuses');
const asyncHandler = require('../helpers/async.hendler');
const successResponse = require('../helpers/success.response');

const getAllProductStatuses = asyncHandler(async (req, res) => {
  const productStatuses = await ProductStatus.findAll();
  successResponse(res, 'Product statuses retrieved successfully', productStatuses);
});

const getProductStatusById = asyncHandler(async (req, res) => {
  const productStatus = await ProductStatus.findByPk(req.params.id);
  if (!productStatus) {
    return res.status(404).json({ message: 'Product status not found' });
  }
  successResponse(res, 'Product status retrieved successfully', productStatus);
});

const createProductStatus = asyncHandler(async (req, res) => {
  const productStatus = await ProductStatus.create(req.body);
  successResponse(res, 'Product status created successfully', productStatus, 201);
});

const updateProductStatus = asyncHandler(async (req, res) => {
  const productStatus = await ProductStatus.findByPk(req.params.id);
  if (!productStatus) {
    return res.status(404).json({ message: 'Product status not found' });
  }
  await productStatus.update(req.body);
  successResponse(res, 'Product status updated successfully', productStatus);
});

const deleteProductStatus = asyncHandler(async (req, res) => {
  const productStatus = await ProductStatus.findByPk(req.params.id);
  if (!productStatus) {
    return res.status(404).json({ message: 'Product status not found' });
  }
  await productStatus.destroy();
  successResponse(res, 'Product status deleted successfully', null, 204);
});

module.exports = {
  getAllProductStatuses,
  getProductStatusById,
  createProductStatus,
  updateProductStatus,
  deleteProductStatus
}; 