'use strict';

// Module dependencies.
var _ = require('lodash');
var Bike = require('../models/bike');
var BikeLog = require('../models/bike_log');
var UserLog = require('../models/user_log');
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

exports.getBike = function(req, res, next) {
	var query = {};

	if (req.params.status)
		query.status = req.params.status;

	Bike.findOne({
		licensePlate: req.params.licensePlate
	}).lean().exec(function getBike(err, bike) {
		return res.status(200).json(bike);
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

var bikeStates = [
	'lended', 'broken', 'stolen', 'repairing',
	'moving', 'storage', 'available'
];

exports.changeStatus = function(req, res, next) {
	return res.status(300).send();
};

/**
 * Function that manages when a bike is lended to an user
 * This methods follows verifyUser, so the req.body.user is already verified
 */
exports.lendBike = function(req, res, next) {
	req.checkBody('comment', 'comment is required').notEmpty();
	req.checkBody('hours', 'hours is required').notEmpty();
	req.checkBody('minutes', 'minutes is required').notEmpty();
	req.checkBody('hours', 'minutes is not a valid number').optional().isPositiveInt();
	req.checkBody('minutes', 'minutes is not a valid number').optional().isPositiveInt();

	var errors = req.validationErrors();
	if (errors)
		return res.status(400).json({
			errors: errors
		});

	var licensePlate = req.params.licensePlate;

	var query = {
		licensePlate: licensePlate
	};

	Bike.findOne(query, function getBikeToLend(err, bike) {

		if (err)
			return next(err);

		if (bike === null)
			return res.status(404).send();

		if (bike.status !== 'available') {
			return res.status(409).json({
				errors: ['This bike is not available']
			});
		}
		var minutes = req.body.minutes;
		var hours = req.body.hours;
		var now = Date.now();
		var estimatedReturn = now
			.setMinutes(now.getMinutes() + minutes)
			.setHours(now.getHours() + hours);
		var comment = req.body.comment;

		var bikeLog = {
			oldState: bike.status,
			newState: 'lended',
			date: now,
			estimatedReturn: estimatedReturn,
			comment: comment,
			submittedBy: req.user._id,
			lendedTo: req.body.lendedTo
		};

		var userLog = {
			action: 'lendBike',
			date: now,
			estimatedReturn: estimatedReturn,
			comment: comment,
			licensePlate: licensePlate
		};

		bike.status = req.body.status;
		bike.save(function saveBike(err) {
			if (err)
				return next(err);

			var bikeQuery = {
				licensePlate: licensePlate
			};
			var userQuery = {
				_id: req.body.user
			};

			var bikeUpdate = {
				$push: {
					log: bikeLog
				}
			};

			var userUpdate = {
				$push: {
					log: userLog
				}
			};

			var options = {
				upsert: true
			};

			BikeLog.update(bikeQuery, bikeUpdate, options)
				.exec(function upsertBikeLog(err, num) {
					if (err) {
						console.err(err);
						throw new Error('There was an error saving the bike log: \n' + err);
					}
				});
			UserLog.update(userQuery, userUpdate, options)
				.exec(function upsertUserLog(err, num) {
					if (err) {
						console.err(err);
						throw new Error('There was an error saving the user log: \n' + err);
					}
				});

			return res.status(200).send();
		});
	});
};

exports.getBikeLog = function(req, res, next) {

	var query = {
		licensePlate: req.params.licensePlate
	};

	BikeLog.findOne(query).lean().exec(function getBike(err, log) {
		if (err)
			return next(err);

		if (!log)
			return res.status(200).json({
				log: []
			});

		return res.status(200).json({
			log: log.log
		});
	});
};
