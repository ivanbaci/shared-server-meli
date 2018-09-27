const express = require("express");
var router = express.Router();

const tokenController = require("../controllers/tokenController");

router.get("/", tokenController.generateToken);

module.exports = router;
