const express = require('express');
const {
  getAllOTPs,
  getOTPById,
  createOTP,
  updateOTP,
  deleteOTP
} = require('../contollers/otp.controller');

const router = express.Router();

router.get('/', getAllOTPs);
router.get('/:id', getOTPById);
router.post('/', createOTP);
router.put('/:id', updateOTP);
router.delete('/:id', deleteOTP);

module.exports = router; 