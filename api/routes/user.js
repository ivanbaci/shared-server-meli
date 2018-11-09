const express = require("express");
var router = express.Router();

const userController = require("../controllers/user");

router.get("/", userController.getUsers);
router.post("/", userController.validateRequest, userController.createUser);

module.exports = router;
