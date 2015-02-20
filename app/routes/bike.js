'use strict';

// User routes use users controller
var express = require('express');
var bike = require('../controllers/bike');
var config = require('../config/config');

var router = express.Router();

router.get('/', bike.getBikes);
router.get('/:licensePlate', bike.getBike);

router.get('/status/:status', bike.getBikes);
router.post('/status', bike.changeStatus);

module.exports = router;
