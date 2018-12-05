const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const token = require("../utils/token");

router.post(
    "/login",
    authController.validateRequest,
    authController.login,
    token.generateToken,
    token.sendToken
);

module.exports = router;
