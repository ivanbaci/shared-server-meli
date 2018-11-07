const express = require("express");
var router = express.Router();

const deliveryController = require("../controllers/delivery");

router.post(
	"/estimate",
	deliveryController.validateRequest,
	deliveryController.estimateDeliveries
);

module.exports = router;
