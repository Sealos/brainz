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
	comment: {
		type: String,
		required: true,
		default: ''
	},
	lendedTo: {
		type: String,
		required: true,
		ref: 'users'
	},
	_id: false,
	submittedBy: {
		type: String,
		required: true,
		ref: 'users'
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
