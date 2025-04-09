const bcrypt = require("bcrypt");
const config = require("config");
const otpGenerator = require("otp-generator");
const Owner = require("../models/owners");
const asyncHandler = require("../helpers/async.hendler");
const successResponse = require("../helpers/success.response");
const { ValidationError, NotFoundError } = require("../helpers/custom.error");
const emailService = require("../services/email.service");
const OTP = require("../models/otp");
const jwtService = require("../services/jwt.service");
const Contract = require("../models/contracts");

const getAllOwners = asyncHandler(async (req, res) => {
  const owners = await Owner.findAll({ include: [Contract] });
  successResponse(res, "Owners retrieved successfully", owners);
});

const getOwnerById = asyncHandler(async (req, res) => {
  const owner = await Owner.findByPk(req.params.id, { include: [Contract] });
  if (!owner) {
    throw new NotFoundError("Owner not found");
  }
  successResponse(res, "Owner retrieved successfully", owner);
});

const createOwner = asyncHandler(async (req, res) => {
  const owner = await Owner.create(req.body);
  successResponse(res, "Owner created successfully", owner, 201);
});

const updateOwner = asyncHandler(async (req, res) => {
  const owner = await Owner.findByPk(req.params.id);
  if (!owner) {
    throw new NotFoundError("Owner not found");
  }
  await owner.update(req.body);
  successResponse(res, "Owner updated successfully", owner);
});

const deleteOwner = asyncHandler(async (req, res) => {
  const owner = await Owner.findByPk(req.params.id);
  if (!owner) {
    throw new NotFoundError("Owner not found");
  }
  await owner.destroy();
  successResponse(res, "Owner deleted successfully", null, 204);
});

const registerOwner = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError("Email and password must be filled");
  }

  const checkUser = await Owner.findOne({ where: { email } });

  if (checkUser) {
    throw new ValidationError("This owner already exists");
  }

  const user = await Owner.create({
    email,
    hashed_password: await bcrypt.hash(password, 10),
  });

  const otp = otpGenerator.generate(4, {
    specialChars: false,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
  });

  const activation = await emailService.sendEmail(email, otp);
  await OTP.create({
    user_id: user.id,
    user_type: "owner",
    otp,
    exp_date: new Date().getTime() + 60000,
  });

  successResponse(res, "Activation code sent to your email", activation);
});

const activateOwner = asyncHandler(async (req, res) => {
  const otp = req.params.otp;

  if (!otp) {
    throw new ValidationError("OTP not found");
  }

  const otpModel = await OTP.findOne({ where: { otp } });

  if (!otpModel) {
    throw new NotFoundError("OTP not found");
  }

  const owner = await Owner.findByPk(otpModel.user_id);
  owner.is_verified = true;
  await owner.save();

  otpModel.is_used = true;
  await otpModel.save();

  successResponse(res, "Owner successfully activated", {
    id: owner.id,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError("Email and password must be filled");
  }

  const user = await Owner.findOne({ where: { email } });

  if (!user) {
    throw new NotFoundError("This owner does not exist");
  }

  const isValidPass = await bcrypt.compare(password, user.hashed_password);

  if (!isValidPass) {
    throw new ValidationError("Password is incorrect");
  }

  const tokens = jwtService.generateTokens({
    sub: user.id,
    role: "owner",
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

  const user = await Owner.findOne({ where: { refresh_token: refreshToken } });

  if (!user) {
    throw new NotFoundError("This owner does not exist");
  }

  const tokens = jwtService.generateTokens({
    sub: user.id,
    role: "owner",
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

const resetPassword = asyncHandler(async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    throw new ValidationError("All fields must be filled");
  }

  const user = await Owner.findOne({ where: { email } });

  if (!user) {
    throw new NotFoundError("Owner not found");
  }

  const isValidPass = await bcrypt.compare(oldPassword, user.hashed_password);

  if (!isValidPass) {
    throw new ValidationError("Current password is incorrect");
  }

  user.hashed_password = await bcrypt.hash(newPassword, 10);
  await user.save();

  successResponse(res, "Password updated successfully");
});

module.exports = {
  getAllOwners,
  getOwnerById,
  createOwner,
  updateOwner,
  deleteOwner,
  registerOwner,
  activateOwner,
  login,
  refreshToken,
  resetPassword,
};
