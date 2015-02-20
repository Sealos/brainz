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
router.post('/repair', bike.repairBike);
router.post('/move', bike.moveBike);

// Todos estos son modificaciones de estado, creo q pueden hacerse en 1 solo....
router.post('/break', bike.breakBike);
router.post('/steal', bike.stealBike);
router.post('/avaliable', bike.avaliableBike);

module.exports = router;