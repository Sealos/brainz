'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
	estimatedReturn: {
		type: Date,
		required: false
	},
	comment: {
		type: String,
		required: true,
		default: ''
	},
	lendedTo: {
		type: String,
		required: false,
		ref: 'user'
	},
	_id: false,
	submittedBy: {
		type: String,
		required: true,
		ref: 'user'
	}
};

var schema = new Schema({
	licensePlate: {
		type: String,
		required: true,
		unique: true,
		index: true
	},
	_id: false,
	log: [Log]
});

module.exports = mongoose.model('bike_log', schema);
