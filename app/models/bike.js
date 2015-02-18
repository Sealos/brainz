'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;
var ObjectId = schema.Types.ObjectId;

var Schema = new schema({
	_id: {
		type: ObjectId,
		required: true,
		unique: true
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
	// Reparacion - reparing
	// En movilizacion - moving
	// En almacen - storage
	// Disponible - available
	status: {
		type: String,
		required: true,
		default: 'available'
	}
});

module.exports = mongoose.model('bike', Schema);
