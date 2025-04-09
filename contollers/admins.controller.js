const bcrypt = require("bcrypt");
const config = require("config");
const Admin = require("../models/admins");
const asyncHandler = require("../helpers/async.hendler");
const successResponse = require("../helpers/success.response");
const { ValidationError, NotFoundError } = require("../helpers/custom.error");
const jwtService = require("../services/jwt.service");

const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await Admin.findAll();
  successResponse(res, "Admins retrieved successfully", admins);
});

const getAdminById = asyncHandler(async (req, res) => {
  const admin = await Admin.findByPk(req.params.id);
  if (!admin) {
    throw new NotFoundError('Admin not found');
  }
  successResponse(res, "Admin retrieved successfully", admin);
});

const createAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.create(req.body);
  successResponse(res, "Admin created successfully", admin, 201);
});

const updateAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findByPk(req.params.id);
  if (!admin) {
    throw new NotFoundError('Admin not found');
  }
  await admin.update(req.body);
  successResponse(res, "Admin updated successfully", admin);
});

const deleteAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findByPk(req.params.id);
  if (!admin) {
    throw new NotFoundError('Admin not found');
  }
  await admin.destroy();
  successResponse(res, "Admin deleted successfully", null, 204);
});

const registerAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError("Email and password must be filled");
  }

  const checkUser = await Admin.findOne({ where: { email } });

  if (checkUser) {
    throw new ValidationError("This admin already exists");
  }

  const user = await Admin.create({
    email,
    hashed_password: await bcrypt.hash(password, 10),
    is_active: true,
  });

  successResponse(res, "New admin created");
});

const ownerLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError("Email and password must be filled");
  }

  const user = await Admin.findOne({ where: { email } });

  if (!user) {
    throw new NotFoundError("This owner does not exist");
  }

  const isValidPass = await bcrypt.compare(password, user.hashed_password);

  if (!isValidPass) {
    throw new ValidationError("Password is incorrect");
  }

  const tokens = jwtService.generateTokens({
    sub: user.id,
    role: "admin",
    email,
    is_creator: user.is_creator,
  });

  user.refresh_token = tokens.refreshToken;
  await user.save();

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    maxAge: config.get("CookieTime"),
  });

  successResponse(res, "Login successful", {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError("Email and password must be filled");
  }

  const user = await Admin.findOne({ where: { email } });

  if (!user) {
    throw new NotFoundError("This admin does not exist");
  }

  const isValidPass = await bcrypt.compare(password, user.hashed_password);

  if (!isValidPass) {
    throw new ValidationError("Password is incorrect");
  }

  const tokens = jwtService.generateTokens({
    sub: user.id,
    role: "admin",
    email,
    is_verified: user.is_verified,
  });

  user.refresh_token = tokens.refreshToken;
  await user.save();

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    maxAge: config.get("CookieTime"),
  });

  successResponse(res, "Login successful", {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new ValidationError("Not authorized");
  }

  const user = await Admin.findOne({ where: { refresh_token: refreshToken } });

  if (!user) {
    throw new NotFoundError("This admin does not exist");
  }

  const tokens = jwtService.generateTokens({
    sub: user.id,
    role: "admin",
    email: user.email,
    is_verified: user.is_verified,
  });

  user.refresh_token = tokens.refreshToken;
  await user.save();

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    maxAge: config.get("CookieTime"),
  });

  successResponse(res, "Token refreshed", {
    newAccessToken: tokens.accessToken,
    newRefreshToken: tokens.refreshToken,
  });
});

module.exports = {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  registerAdmin,
  login,
  refreshToken,
  ownerLogin
};
