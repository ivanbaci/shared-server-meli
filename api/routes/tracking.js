const express = require("express");
var router = express.Router();

const trackingController = require("../controllers/tracking");

router.get("/", trackingController.getAll);

router.post(
    "/",
    trackingController.validateTracking,
    trackingController.createNewShipping
);

router.get("/:id", trackingController.getTrackingById);

router.put(
    "/:id",
    trackingController.validateTracking,
    trackingController.updateTracking,
    trackingController.notifyAppServer
);

module.exports = router;
