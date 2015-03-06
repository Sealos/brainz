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

var bikeStates = ['lended','broken', 'stolen', 'repairing', 'moving', 'storage', 'available'];

exports.changeStatus = function(req, res, next) {
	req.checkBody('status', 'status is required').notEmpty();
	req.checkBody('comment', 'comment is required').notEmpty();

	var errors = req.validationErrors();
	if (errors)
		return res.status(400).json({
			errors: errors
		});

	var newStatus = req.body.status;

	var statusIndex = _.indexOf(bikeStates, newStatus);

	if (statusIndex < 0)
		return res.status(400).json({
			errors: ['Invalid status']
		});

	var query = {
		licensePlate: req.params.licensePlate
	};

	Bike.findOne(query, function getBikeToLend(err, bike) {
		if (err)
			return next(err);

		if (bike === null)
			return res.status(404).send();

		if (bike.status === req.body.status) {
			return res.status(409).json({
				errors: ['No change in status']
			});
		}

		var log = {
			oldState: bike.status,
			newState: newStatus,
			date: Date.now(),
			comment: req.body.comment,
			submittedBy: req.user._id
		};

		var lendedTo = req.body.lendedTo;

		if (lendedTo !== undefined)
			log.lendedTo = lendedTo;

		bike.status = req.body.status;
		bike.save(function saveBike(err) {
			if (err)
				return next(err);

			var query = {
				licensePlate: req.body.licensePlate
			};

			var update = {
				$push: {
					log: log
				}
			};

			BikeLog.update(query, update, {
				upsert: true
			}, function upsertLog(err, num) {});

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
