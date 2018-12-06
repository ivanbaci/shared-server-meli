const express = require("express");
var router = express.Router();

const statsController = require("../controllers/stats");

router.get("/users", statsController.getUsers);

router.get("/products", statsController.getProducts);

router.get("/sales", statsController.getSales);

module.exports = router;
