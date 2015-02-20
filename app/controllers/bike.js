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

	Bike.find(query, 'licensePlate brand').lean().exec(function getAllBikes(err, bikes) {
		return res.status(200).json(bikes);
	});
};

exports.createBike = function(req, res, next) {
	req.checkBody('licensePlate', 'licensePlate is required').notEmpty();
	req.checkBody('color', 'color is required').notEmpty();
	req.checkBody('brand', 'brand is required').notEmpty();

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
			return res.status(409).json({
				err: 'Duplicated licensePlate'
			});

		return res.status(200).send();
	});
};

exports.changeStatus = function(req, res, next) {

	req.checkBody('bikeId', 'bikeId is required').notEmpty();
	req.checkBody('status', 'status is required').notEmpty();
	req.checkBody('comment', 'commnet is required').notEmpty();

	var errors = req.validationErrors();
	if (errors)
		return res.status(400).json({
			errors: errors
		});

	Bike.findOne(new ObjectId(req.body.bikeId), function getBikeToLend(err, bike) {
		if (err)
			return next(err);

		if (bike === null)
			return res.status(404).send();

		var log = {
			oldState: bike.status,
			newState: req.body.status,
			date: Date.now(),
			comment: req.body.comment
		};

		bike.status = req.body.status;
		bike.log.push(log);
		// NOTE(sdecolli): Finish this when we have user data
		bike.save(function saveBike(err) {
			if (err)
				return next(err);

			return res.status(200).send();
		});
	});
};
