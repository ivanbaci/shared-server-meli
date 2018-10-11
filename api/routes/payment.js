const express = require("express");
var router = express.Router();

const paymentController = require("../controllers/payment");

router.get("/", paymentController.getAllPayments);

router.post("/", paymentController.createNewPayment);

router.get("/methods", paymentController.getMethods);

module.exports = router;
