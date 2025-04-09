const OTP = require('../models/otp');
const asyncHandler = require('../helpers/async.hendler');
const successResponse = require('../helpers/success.response');

const getAllOTPs = asyncHandler(async (req, res) => {
  const otps = await OTP.findAll();
  successResponse(res, 'OTPs retrieved successfully', otps);
});

const getOTPById = asyncHandler(async (req, res) => {
  const otp = await OTP.findByPk(req.params.id);
  if (!otp) {
    return res.status(404).json({ message: 'OTP not found' });
  }
  successResponse(res, 'OTP retrieved successfully', otp);
});

const createOTP = asyncHandler(async (req, res) => {
  const otp = await OTP.create(req.body);
  successResponse(res, 'OTP created successfully', otp, 201);
});

const updateOTP = asyncHandler(async (req, res) => {
  const otp = await OTP.findByPk(req.params.id);
  if (!otp) {
    return res.status(404).json({ message: 'OTP not found' });
  }
  await otp.update(req.body);
  successResponse(res, 'OTP updated successfully', otp);
});

const deleteOTP = asyncHandler(async (req, res) => {
  const otp = await OTP.findByPk(req.params.id);
  if (!otp) {
    return res.status(404).json({ message: 'OTP not found' });
  }
  await otp.destroy();
  successResponse(res, 'OTP deleted successfully', null, 204);
});

module.exports = {
  getAllOTPs,
  getOTPById,
  createOTP,
  updateOTP,
  deleteOTP
}; 