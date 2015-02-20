'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;
var ObjectId = schema.Types.ObjectId;

var Log = {
	oldState: {
		type: String,
		required: true
	},
	newState: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true,
		default: Date.now()
	},
	comment: {
		type: String,
		required: true,
		default: ''
	},
	_id: false
};

var Schema = new schema({
	_id: {
		type: ObjectId,
		required: true,
		unique: true,
		default: mongoose.Types.ObjectId()
	},
	licensePlate: {
		type: String,
		required: true,
		unique: true,
	},
	color: {
		type: String,
		required: true,
		default: 'Red'
	},
	brand: {
		type: String,
		required: true
	},

	// En uso - Lended
	// Danada - broken
	// Robada - stolen
	// Reparacion - repairing
	// En movilizacion - moving
	// En almacen - storage
	// Disponible - available
	status: {
		type: String,
		required: true,
		default: 'available',
		index: true
	},
	log: [Log]
});

module.exports = mongoose.model('bike', Schema);