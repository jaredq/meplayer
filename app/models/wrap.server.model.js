'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Wrap Schema
 */
var WrapSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Wrap name',
		trim: true
	},
	content: {
		type: String,
		default: '',
		required: 'Please fill Wrap content',
		trim: true
	},
	contentType: {
		type: String,
		default: '',
		required: 'Please fill Wrap content type',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Wrap', WrapSchema);