const express = require('express');
const {
  getAllProductStatuses,
  getProductStatusById,
  createProductStatus,
  updateProductStatus,
  deleteProductStatus
} = require('../contollers/product.statuses.controller');

const router = express.Router();

router.get('/', getAllProductStatuses);
router.get('/:id', getProductStatusById);
router.post('/', createProductStatus);
router.put('/:id', updateProductStatus);
router.delete('/:id', deleteProductStatus);

module.exports = router; 