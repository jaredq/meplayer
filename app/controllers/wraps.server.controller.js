'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Wrap = mongoose.model('Wrap'),
	_ = require('lodash');

/**
 * Create a Wrap
 */
exports.create = function(req, res) {
	var wrap = new Wrap(req.body);
	wrap.user = req.user;

	wrap.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wrap);
		}
	});
};

/**
 * Show the current Wrap
 */
exports.read = function(req, res) {
	res.jsonp(req.wrap);
};

/**
 * Update a Wrap
 */
exports.update = function(req, res) {
	var wrap = req.wrap ;

	wrap = _.extend(wrap , req.body);

	wrap.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wrap);
		}
	});
};

/**
 * Delete an Wrap
 */
exports.delete = function(req, res) {
	var wrap = req.wrap ;

	wrap.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wrap);
		}
	});
};

/**
 * List of Wraps
 */
exports.list = function(req, res) { 
	Wrap.find().sort('-created').populate('user', 'displayName').exec(function(err, wraps) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wraps);
		}
	});
};

/**
 * Wrap middleware
 */
exports.wrapByID = function(req, res, next, id) { 
	Wrap.findById(id).populate('user', 'displayName').exec(function(err, wrap) {
		if (err) return next(err);
		if (! wrap) return next(new Error('Failed to load Wrap ' + id));
		req.wrap = wrap ;
		next();
	});
};

/**
 * Wrap authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.wrap.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
