const express = require("express");
var router = express.Router();

const trackingController = require("../controllers/tracking");

router.post(
	"/",
	trackingController.validateTracking,
	trackingController.createNewShipping
);

router.get("/:id", trackingController.getTrackingById);

router.put(
	"/:id",
	trackingController.validateTracking,
	trackingController.updateTracking
);

module.exports = router;
