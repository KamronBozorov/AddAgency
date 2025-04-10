const bcrypt = require("bcrypt");
const config = require("config");
const otpGenerator = require("otp-generator");
const Client = require("../models/clients");
const asyncHandler = require("../helpers/async.hendler");
const successResponse = require("../helpers/success.response");
const { ValidationError, NotFoundError } = require("../helpers/custom.error");
const { sendEmail } = require("../services/email.service");
const emailService = require("../services/email.service");
const OTP = require("../models/otp");
const jwtService = require("../services/jwt.service");
const Contract = require("../models/contracts");
const sequelize = require("../config/db");

const getAllClients = asyncHandler(async (req, res) => {
  const clients = await Client.findAll({ include: [Contract] });
  successResponse(res, "Clients retrieved successfully", clients);
});

const getClientById = asyncHandler(async (req, res) => {
  const client = await Client.findByPk(req.params.id, { include: [Contract] });
  if (!client) {
    throw new NotFoundError("Client not found");
  }
  successResponse(res, "Client retrieved successfully", client);
});

const createClient = asyncHandler(async (req, res) => {
  const client = await Client.create(req.body);
  successResponse(res, "Client created successfully", client, 201);
});

const updateClient = asyncHandler(async (req, res) => {
  const client = await Client.findByPk(req.params.id);
  if (!client) {
    throw new NotFoundError("Client not found");
  }
  await client.update(req.body);
  successResponse(res, "Client updated successfully", client);
});

const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findByPk(req.params.id);
  if (!client) {
    throw new NotFoundError("Client not found");
  }
  await client.destroy();
  successResponse(res, "Client deleted successfully", null, 204);
});

const registerClient = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError("Email and password must be filled");
  }

  const checkUser = await Client.findOne({ where: { email } });

  if (checkUser) {
    throw new ValidationError("This user already exists");
  }

  const user = await Client.create({
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
    user_type: "client",
    otp,
    exp_date: new Date().getTime() + 60000,
  });

  successResponse(res, "Activation code sent to your email.", activation);
});

const activateClient = asyncHandler(async (req, res) => {
  const otp = req.params.otp;

  if (!otp) {
    throw new ValidationError("OTP not found");
  }

  const otpModel = await OTP.findOne({ where: { otp } });

  if (!otpModel) {
    throw new NotFoundError("OTP not found");
  }

  const client = await Client.findByPk(otpModel.user_id);
  client.is_verified = true;
  client.save();

  otpModel.is_used = true;
  otpModel.save();

  successResponse(res, "Client successfully activated", {
    id: client.id,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError("Email and password must be filled");
  }

  const user = await Client.findOne({ where: { email } });

  if (!user) {
    throw new NotFoundError("This user does not exist");
  }

  const isValidPass = await bcrypt.compare(password, user.hashed_password);

  if (!isValidPass) {
    throw new ValidationError("Password is incorrect");
  }

  const tokens = jwtService.generateTokens({
    sub: user.id,
    role: "client",
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

  const user = await Client.findOne({ where: { refresh_token: refreshToken } });

  if (!user) {
    throw new NotFoundError("This user does not exist");
  }

  const tokens = jwtService.generateTokens({
    sub: user.id,
    role: "client",
    email: user.email,
    is_verified: user.is_verified,
  });

  user.refresh_token = tokens.refreshToken;
  await user.save();

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    maxAge: config.get("CookieTime"),
  });

  successResponse(res, "Token refreshed.", {
    newAccessToken: tokens.accessToken,
    newRefreshToken: tokens.refreshToken,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, oldPassword, newPassword, confirmPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    throw new ValidationError("All fields must be filled");
  }

  const user = await Client.findOne({ where: { email } });

  if (!user) {
    throw new NotFoundError("Owner not found");
  }

  const isValidPass = await bcrypt.compare(oldPassword, user.hashed_password);

  if (!isValidPass) {
    throw new ValidationError("Current password is incorrect");
  }

  if (newPassword !== confirmPassword)
    throw new ValidationError("New password and confirm password do not match");

  user.hashed_password = await bcrypt.hash(newPassword, 10);
  await user.save();

  successResponse(res, "Password updated successfully");
});

const paidProducts = asyncHandler(async (req, res) => {
  const { email } = req.query;

  if (!email)
    return res.status(404).json({
      type: "Error",
      message: `${email} was not found, please create account`,
    });

  const client = await Client.findOne({ where: { email } });

  if (!client)
    return res.status(404).json({
      type: "Error",
      message: `Client was not found`,
    });

  const paidProducts = await sequelize.query(
    `
    SELECT 
	P.title, PS."name"
    FROM products P
    JOIN owners O ON O.id = P."OwnerId"
    JOIN categories CG ON P."CategoryId" = CG.id
    JOIN contracts CT ON CT."product_id" = P.id
    JOIN payments PY ON PY."ContractId" = CT.id
    JOIN clients C ON C.id = CT."client_id"
    JOIN payment_statuses PS ON PS.id = PY."PaymentStatusId"
    WHERE C.id = :clientId
    GROUP BY P.title, PS."name", C.email
    `,
    {
      replacements: {
        clientId: client.id,
      },
      type: sequelize.QueryTypes.SELECT,
    },
  );

  successResponse(res, `Client ${client.id} ID has paid:`, paidProducts);
});

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  registerClient,
  activateClient,
  login,
  refreshToken,
  resetPassword,
  paidProducts,
};
