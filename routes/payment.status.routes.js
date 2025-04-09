const express = require('express');
const {
  getAllPaymentStatuses,
  getPaymentStatusById,
  createPaymentStatus,
  updatePaymentStatus,
  deletePaymentStatus
} = require('../contollers/payment.statuses.controller');

const router = express.Router();

router.get('/', getAllPaymentStatuses);
router.get('/:id', getPaymentStatusById);
router.post('/', createPaymentStatus);
router.put('/:id', updatePaymentStatus);
router.delete('/:id', deletePaymentStatus);

module.exports = router; 