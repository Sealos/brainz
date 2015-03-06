'use strict';

// Module dependencies.
var _ = require('lodash');
var Bike = require('../models/bike');
var BikeStation = require('../models/bike_station');
var BikeLog = require('../models/bike_log');
var UserLog = require('../models/user_log');
var ObjectId = require('mongodb').ObjectID;

exports.getStations = function(req, res, next) {
	var query = {
		active: true
	};

	BikeStation.find(query).lean().exec(function getAvailableStations(err, stations) {
		if (err)
			return next(err);

		return res.status(200).json({
			stations: stations
		});
	});
};

exports.addStation = function(req, res, next) {
	req.checkBody('name', 'name is required').notEmpty();
	req.checkBody('location', 'location is required').notEmpty();
	req.checkBody('location', 'location must have a valid format').optional().isValidLocation();
	var errors = req.validationErrors();
	if (errors)
		return res.status(400).json({
			errors: errors
		});

	var locArray = _.map(req.body.location.split(','), function mapToFloat(value) {
		return parseFloat(value);
	});

	var station = new BikeStation({
		name: req.body.name,
		location: {
			locType: 'point',
			coordinates: locArray
		}
	});

	station.save(function saveNewStation(err) {
		if (err)
			return next(err);

		return res.status(200).json({
			station: station._id
		});
	});
};

exports.removeStation = function(req, res, next) {
	req.checkParams('bikeStationId', 'bikeStationId must have a length of 24').optional().len(24, 24);
	var errors = req.validationErrors();
	if (errors)
		return res.status(400).json({
			errors: errors
		});

	var bikeStationId = new ObjectId(req.params.bikeStationId);
	BikeStation.findOneAndRemove(bikeStationId, function getStation(err) {
		if (err)
			return next(err);
		return res.status(200).send();
	});
};
