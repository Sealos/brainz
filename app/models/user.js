'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var config = require('../config/config');

var userSchema = new Schema({
	_id: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	usbId: {
		type: String,
		unique: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true
	},
	address: {

		line: {
			type: String
		},
		city: {
			type: String
		},
		state: {
			type: String
		},

		default: {
			line: '',
			city: '',
			state: '',
		}
	},
	appVersion: {
		type: String
	},
	apiVersion: {
		type: Number,
		default: config.apiVersion
	},
	dateOfBirth: {
		type: Date
	},
	gender: {
		type: String
	},
	lastAccess: {
		type: Date,
		default: Date.now()
	},
	mobilePhone: [String],
	name: {
		first: {
			type: String
		},
		last: {
			type: String
		},
		default: {
			first: '',
			last: ''
		}
	},
	password: {
		type: String,
		default: '',
		required: true
	},
	registerDate: {
		type: Date,
		default: Date.now(),
		required: true
	},
	salt: {
		type: String
	},
	permission: {
		type: Number,
		default: 0,
		required: true
	},
	lastKnownLoc: [Number],
	devices: [{
		agent: {
			type: String
		},
		token: {
			type: String
		},
		_id: false
	}],
}, {
	versionKey: false
});

userSchema.pre('save', function beforeSave(next) {
	var user = this;

	if (!user.isModified('password'))
		return next();

	user.salt = user.makeSalt();
	user.password = user.hashPassword(user.password);

	return next();
});

userSchema.methods = {

	auth: function(password) {
		return this.hashPassword(password) === this.password;
	},

	hashPassword: function(password) {
		var hash = crypto.createHash('SHA256').update(password + this.salt).digest('hex');
		return hash;
	},

	makeSalt: function() {
		return crypto.randomBytes(16).toString('hex');
	},

	isAdmin: function() {
		return (this.permission & config.permission.admin) > 0;
	},

	/*isOperator: function() {
		return (this.permission & config.permission.operator) > 0;
	},*/
};

module.exports = mongoose.model('user', userSchema);
