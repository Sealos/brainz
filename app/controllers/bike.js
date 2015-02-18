'use strict';

// Module dependencies.
var _ = require('lodash');
var Bike = require('../models/bike');
var ObjectId = require('mongodb').ObjectID;

/**
 * Returns the current user profile data
 */
exports.getBikes = function(req, res, next) {
	var query = {};

	if (req.params.status)
		query.status = req.params.status;

	Bike.find(query).lean().exec(function getAllBikes(err, bikes) {
		return res.status(200).json(bikes);
	});
};

exports.createBike = function(req, res, next) {

	req.checkBody('licensePlate', 'licensePlate is required').isEmpty();
	req.checkBody('color', 'color is required').isEmpty();
	req.checkBody('brand', 'brand is required').isEmpty();

	var errors = req.validationErrors();
	if (errors)
		return res.status(400).json({
			errors: errors
		});

	var newBike = new Bike({
		licensePlate: req.body.licensePlate,
		color: req.body.color,
		brand: req.body.brand,
	});

	newBike.save(function saveBike(err) {
		if (err)
			return next(err);

		return res.status(200).send();
	});
};

exports.lendBike = function(req, res, next) {

	req.checkBody('bikeId', 'Bike id is required').isEmpty();

	var errors = req.validationErrors();
	if (errors)
		return res.status(400).json({
			errors: errors
		});

	var query = {
		_id: new ObjectId(req.body.bikeId)
	};

	Bike.find(query, function getBikeToLend(err, bike) {
		if (err)
			return next(err);

		bike.status = 'lended';
		// NOTE(sdecolli): Finish this when we have user data
		bike.save(function saveBike(err) {
			if (err)
				return next(err);

			return res.status(200).send();
		});
	});
};
