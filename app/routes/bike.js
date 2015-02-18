'use strict';

// User routes use users controller
var express = require('express');
var bike = require('../controllers/bike');
var config = require('../config/config');

var router = express.Router();

router.get('/', bike.getBikes);

router.get('/status/:status', bike.getBikes);
router.post('/create', bike.createBike);

router.post('/lend', bike.lendBike);

module.exports = router;
