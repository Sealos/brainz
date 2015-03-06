'use strict';

// User routes use users controller
var express = require('express');
var bike = require('../controllers/bike');
var config = require('../config/config');
var userPermission = require('../middlewares/user_permission');

var router = express.Router();

router.get('/', bike.getBikes);
router.get('/:licensePlate', bike.getBike);
router.get('/:licensePlate/log', bike.getBikeLog);
router.post('/:licensePlate/status', userPermission(config.permission.operator), bike.changeStatus);

router.get('/status/:status', bike.getBikes);

router.post('/', userPermission(config.permission.admin), bike.createBike);

module.exports = router;
