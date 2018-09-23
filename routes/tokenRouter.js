const express = require('express');
var tokenRouter = express.Router();
const tokenController = require('../controllers/tokenController')

tokenRouter.get('/', tokenController.generateToken);

module.exports = tokenRouter;