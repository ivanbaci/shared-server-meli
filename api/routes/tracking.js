const express = require("express");
var router = express.Router();

const trackingController = require("../controllers/trackingController");

router.post("/", trackingController.createNewShipping);

router.get("/:id", trackingController.getTrackingById);

module.exports = router;
