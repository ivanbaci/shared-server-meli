const express = require("express");
var router = express.Router();

const tokenController = require("../controllers/token");

router.get("/", tokenController.generateToken);

module.exports = router;
