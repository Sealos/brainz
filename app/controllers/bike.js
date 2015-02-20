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

exports.lendBike = function(req, res, next) {

	req.checkBody('bikeId', 'Bike id is required').notEmpty();

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

exports.repairBike = function(req, res, next) {

	req.checkBody('bikeId', 'Bike id is required').notEmpty();

	var errors = req.validationErrors();
	if (errors)
		return res.status(400).json({
			errors: errors
		});

	var query = {
		_id: new ObjectId(req.body.bikeId)
	};

	Bike.find(query).lean().exec(function getPlaceToRepair(err, bikes) {
		if (err)
			return next(err);

		bike.status = 'repairing';
		// 
		bike.save(function saveBike(err) {
			if (err)
				return next(err);

			return res.status(200).send();
		});
	});
};

exports.moveBike = function(req, res, next) {

	req.checkBody('bikeId', 'Bike id is required').notEmpty();

	var errors = req.validationErrors();
	if (errors)
		return res.status(400).json({
			errors: errors
		});

	var query = {
		_id: new ObjectId(req.body.bikeId)
	};

	Bike.find(query).lean().exec(function getAllBikes(err, bikes) {
		if (err)
			return next(err);

		bike.status = 'moving'; // Aqui seria bueno colocar el destino al q c mueve, no estoy claro d como/donde hacerlo
		//**************************************************************************************************************
		//**************************************************************************************************************
		//**************************************************************************************************************
		//**************************************************************************************************************

		bike.save(function saveBike(err) {
			if (err)
				return next(err);

			return res.status(200).send();
		});
	});
};

exports.breakBike = function(req, res, next) {

	req.checkBody('bikeId', 'Bike id is required').notEmpty();

	var errors = req.validationErrors();
	if (errors)
		return res.status(400).json({
			errors: errors
		});

	var query = {
		_id: new ObjectId(req.body.bikeId)
	};

	Bike.find(query).lean().exec(function getAllBikes(err, bikes) {
		if (err)
			return next(err);

		bike.status = 'broken';

		bike.save(function saveBike(err) {
			if (err)
				return next(err);

			return res.status(200).send();
		});
	});
};

exports.stealBike = function(req, res, next) {

	req.checkBody('bikeId', 'Bike id is required').notEmpty();

	var errors = req.validationErrors();
	if (errors)
		return res.status(400).json({
			errors: errors
		});

	var query = {
		_id: new ObjectId(req.body.bikeId)
	};

	Bike.find(query).lean().exec(function getAllBikes(err, bikes) {
		if (err)
			return next(err);

		bike.status = 'stolen';

		bike.save(function saveBike(err) {
			if (err)
				return next(err);

			return res.status(200).send();
		});
	});
};

exports.avaliableBike = function(req, res, next) {

	req.checkBody('bikeId', 'Bike id is required').notEmpty();

	var errors = req.validationErrors();
	if (errors)
		return res.status(400).json({
			errors: errors
		});

	var query = {
		_id: new ObjectId(req.body.bikeId)
	};

	Bike.find(query).lean().exec(function getAllBikes(err, bikes) {
		if (err)
			return next(err);

		bike.status = 'avaliable';

		bike.save(function saveBike(err) {
			if (err)
				return next(err);

			return res.status(200).send();
		});
	});
};