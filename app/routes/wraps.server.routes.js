'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var wraps = require('../../app/controllers/wraps.server.controller');

	// Wraps Routes
	app.route('/wraps')
		.get(wraps.list)
		.post(users.requiresLogin, wraps.create);

	app.route('/wraps/:wrapId')
		.get(wraps.read)
		.put(users.requiresLogin, wraps.hasAuthorization, wraps.update)
		.delete(users.requiresLogin, wraps.hasAuthorization, wraps.delete);

	app.route('/wraps2/:wrapId')
		.get(wraps.read)
		.put(users.requiresLogin, wraps.hasAuthorization, wraps.update)
		.delete(users.requiresLogin, wraps.hasAuthorization, wraps.delete);

	// Finish by binding the Wrap middleware
	app.param('wrapId', wraps.wrapByID);
};
