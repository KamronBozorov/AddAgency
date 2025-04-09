const express = require('express');
const {
  getAllContractStatuses,
  getContractStatusById,
  createContractStatus,
  updateContractStatus,
  deleteContractStatus
} = require('../contollers/contract.statuses.controller');

const router = express.Router();

router.get('/', getAllContractStatuses);
router.get('/:id', getContractStatusById);
router.post('/', createContractStatus);
router.put('/:id', updateContractStatus);
router.delete('/:id', deleteContractStatus);

module.exports = router; 