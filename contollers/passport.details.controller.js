const PassportDetail = require('../models/pasport.details');
const asyncHandler = require('../helpers/async.hendler');
const successResponse = require('../helpers/success.response');

const getAllPassportDetails = asyncHandler(async (req, res) => {
  const passportDetails = await PassportDetail.findAll();
  successResponse(res, 'Passport details retrieved successfully', passportDetails);
});

const getPassportDetailById = asyncHandler(async (req, res) => {
  const passportDetail = await PassportDetail.findByPk(req.params.id);
  if (!passportDetail) {
    return res.status(404).json({ message: 'Passport detail not found' });
  }
  successResponse(res, 'Passport detail retrieved successfully', passportDetail);
});

const createPassportDetail = asyncHandler(async (req, res) => {
  const passportDetail = await PassportDetail.create(req.body);
  successResponse(res, 'Passport detail created successfully', passportDetail, 201);
});

const updatePassportDetail = asyncHandler(async (req, res) => {
  const passportDetail = await PassportDetail.findByPk(req.params.id);
  if (!passportDetail) {
    return res.status(404).json({ message: 'Passport detail not found' });
  }
  await passportDetail.update(req.body);
  successResponse(res, 'Passport detail updated successfully', passportDetail);
});

const deletePassportDetail = asyncHandler(async (req, res) => {
  const passportDetail = await PassportDetail.findByPk(req.params.id);
  if (!passportDetail) {
    return res.status(404).json({ message: 'Passport detail not found' });
  }
  await passportDetail.destroy();
  successResponse(res, 'Passport detail deleted successfully', null, 204);
});

module.exports = {
  getAllPassportDetails,
  getPassportDetailById,
  createPassportDetail,
  updatePassportDetail,
  deletePassportDetail
}; 