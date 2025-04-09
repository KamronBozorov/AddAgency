const express = require("express");
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  successfulOwners,
} = require("../contollers/category.controller");
const adminCreatorGuard = require("../guards/admin.creator.guard");

const router = express.Router();

router.post("/ws/succesfull-owners", adminCreatorGuard, successfulOwners);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;

