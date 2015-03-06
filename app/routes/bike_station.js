'use strict';

var express = require('express');
var bikeStation = require('../controllers/bike_station');
//var config = require('../config/config');

var router = express.Router();

router.get('/', bikeStation.getStations);
router.post('/', bikeStation.addStation);
router.delete('/:bikeStationId', bikeStation.removeStation);

module.exports = router;
