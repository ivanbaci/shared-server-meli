const express = require("express");
var router = express.Router();
const Validate = require("express-validation");

const tokenController = require("../controllers/token");

router.post(
	"/",
	tokenController.validateRequest,
	tokenController.generateToken
);

module.exports = router;
