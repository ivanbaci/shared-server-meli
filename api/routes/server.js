const express = require("express");
var router = express.Router();

const serverController = require("../controllers/server");

router.get("/", serverController.getServers);

router.post("/", serverController.saveServer);

router.get("/:id", serverController.getServerById);

router.put("/:id", serverController.updateServer);

router.post("/:id", serverController.resetServerToken);

router.delete("/:id", serverController.deleteServer);

module.exports = router;
