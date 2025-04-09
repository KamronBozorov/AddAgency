const Category = require("../models/category");
const asyncHandler = require("../helpers/async.hendler");
const successResponse = require("../helpers/success.response");
const { Sequelize } = require("sequelize");
const sequelize = require("../config/db");

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.findAll();
  successResponse(res, "Categories retrieved successfully", categories);
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  successResponse(res, "Category retrieved successfully", category);
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  successResponse(res, "Category created successfully", category, 201);
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  await category.update(req.body);
  successResponse(res, "Category updated successfully", category);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  await category.destroy();
  successResponse(res, "Category deleted successfully", null, 204);
});

const successfulOwners = asyncHandler(async (req, res) => {
  const { name, limit } = req.query;

  if (!name || !limit)
    return res.status(404).json({
      type: "Error",
      message: "Please provide name and limit",
    });

  const category = await Category.findOne({
    where: {
      name: name
    },
  });

  if (!category)
    return res.status(404).json({
      type: "Error",
      message: `Category named as ${name} was not found`,
    });

  const owners = await sequelize.query(
    `
    SELECT 
        O.email AS owner_email,
        COUNT(P.id) AS rental_count
    FROM products P
    JOIN owners O ON O.id = P."OwnerId"
    JOIN categories C ON P."CategoryId" = C.id
    WHERE C.id = :categoryId
    GROUP BY C.name, O.email
    ORDER BY rental_count DESC
    LIMIT :limit
    `,
    {
      replacements: {
        categoryId: category.id,
        limit: parseInt(limit)
      },
      type:  sequelize.QueryTypes.SELECT
    }
  );

  successResponse(
    res,
    `${limit} successful owners in ${name} category`,
    owners,
  );
});
module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  successfulOwners,
};
