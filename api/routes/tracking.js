const express = require("express");
var router = express.Router();

const trackingController = require("../controllers/tracking");

router.post("/", trackingController.createNewShipping);

router.get("/:id", trackingController.getTrackingById);

module.exports = router;
