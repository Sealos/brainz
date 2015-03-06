'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var locPoint = {
	locType: {
		type: String,
		required: true
	},
	coordinates: [Number]
};

var bikeStationSchema = new Schema({
	_id: {
		type: ObjectId,
		required: true,
		unique: true,
		index: true,
		default: mongoose.Types.ObjectId()
	},
	name: {
		type: String,
		required: true
	},
	location: {
		type: locPoint
	},
	active: {
		type: Boolean,
		required: true,
		default: false
	},
	bikes: [{
		type: ObjectId,
		ref: 'bikes'
	}]
});

module.exports = mongoose.model('bike_station', bikeStationSchema);
