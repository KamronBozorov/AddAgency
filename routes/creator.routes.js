const express = require("express");
const {
  getAllCreators,
  getCreatorById,
  createCreator,
  updateCreator,
  deleteCreator,
  registerCreator,
  activateCreator,
  login,
  refreshToken,
} = require("../contollers/creators.controller");

const router = express.Router();

router.post("/register", registerCreator);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.get("/activate/:otp", activateCreator);

router.get("/", getAllCreators);
router.get("/:id", getCreatorById);
router.post("/", createCreator);
router.put("/:id", updateCreator);
router.delete("/:id", deleteCreator);

module.exports = router;

