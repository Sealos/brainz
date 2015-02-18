'use strict';

// User routes use users controller
var express = require('express');
var bike = require('../controllers/bike');
var config = require('../config/config');

var router = express.Router();
var jwtSecret = jwt({
	secret: config.jwt
});

router.get('/', bike.getBikes);

router.get('/status/:status', getBikes);
router.post('/create', bike.createBike);

router.post('/lend', bike.lendBike);

module.exports = router;
