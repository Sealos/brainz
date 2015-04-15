'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var schema = new Schema({
	_id: {
		type: ObjectId,
		required: true,
		unique: true,
		index: true,
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
	private: {
		type: Boolean,
		default: false,
		required: true
	},

	status: {
		type: String,
		required: true,
		default: 'available',
		enum: [
			'lended', 'broken', 'stolen', 'repairing',
			'moving', 'storage', 'available'
		],
		index: true
	},
});

module.exports = mongoose.model('bike', schema);
