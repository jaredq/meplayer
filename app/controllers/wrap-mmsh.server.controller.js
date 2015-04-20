'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Wrap = mongoose.model('Wrap'),
	_ = require('lodash');

/**
 * Show the current Wrap
 */
exports.readSample = function(req, res) {
	var os = require('os');
	res.set('Cache-Control', 'max-age=0, no-cache');
	res.set('Connection', 'close');
	res.set('Content-Type', 'video/x-ms-asf');
	res.set('Pragma', 'no-cache, xResetStrm=1');
	res.set('Server', 'Cougar/9.6.7600.16564');
	res.set('Supported', 'com.microsoft.wm.srvppair, com.microsoft.wm.sswitch, com.microsoft.wm.predstrm, com.microsoft.wm.fastcache, com.microsoft.wm.startupprofile');
	res.set(200);
	res.send('[Reference]' + os.EOL + 'Ref1=mmsh://vp.rice.edu/KTRU2001?MSWMExt=.asf' + os.EOL);
	res.end();
};

/**
 * Show the current Wrap
 */
exports.read = function(req, res) {
	var content = 'Ref1=';
	var contentType = 'video/x-ms-asf';
	if (req.wrap) {
		content = req.wrap.content;
		contentType = req.wrap.contentType;
	}
	
	var os = require('os');
	res.set('Cache-Control', 'max-age=0, no-cache');
	res.set('Connection', 'close');
	res.set('Content-Type', contentType);
	res.set('Pragma', 'no-cache, xResetStrm=1');
	res.set('Server', 'Cougar/9.6.7600.16564');
	res.set('Supported', 'com.microsoft.wm.srvppair, com.microsoft.wm.sswitch, com.microsoft.wm.predstrm, com.microsoft.wm.fastcache, com.microsoft.wm.startupprofile');
	res.set(200);
	res.send('[Reference]' + os.EOL + content + os.EOL);
	res.end();
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
