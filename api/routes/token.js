const express = require("express");
var router = express.Router();

const tokenController = require("../controllers/token");

router.post("/", tokenController.generateToken);

module.exports = router;
