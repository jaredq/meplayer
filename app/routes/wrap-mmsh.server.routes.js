'use strict';

module.exports = function(app) {
	var mmsh = require('../../app/controllers/wrap-mmsh.server.controller');
	
	app.route('/wrap-mmsh')
		.get(mmsh.readSample);
		
	// Routing logic   
	app.route('/wrap-mmsh/:wrapId')
		.get(mmsh.read);

	// Finish by binding the Wrap middleware
	app.param('wrapId', mmsh.wrapByID);
};