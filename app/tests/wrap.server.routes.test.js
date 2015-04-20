'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Wrap = mongoose.model('Wrap'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, wrap;

/**
 * Wrap routes tests
 */
describe('Wrap CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Wrap
		user.save(function() {
			wrap = {
				name: 'Wrap Name'
			};

			done();
		});
	});

	it('should be able to save Wrap instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wrap
				agent.post('/wraps')
					.send(wrap)
					.expect(200)
					.end(function(wrapSaveErr, wrapSaveRes) {
						// Handle Wrap save error
						if (wrapSaveErr) done(wrapSaveErr);

						// Get a list of Wraps
						agent.get('/wraps')
							.end(function(wrapsGetErr, wrapsGetRes) {
								// Handle Wrap save error
								if (wrapsGetErr) done(wrapsGetErr);

								// Get Wraps list
								var wraps = wrapsGetRes.body;

								// Set assertions
								(wraps[0].user._id).should.equal(userId);
								(wraps[0].name).should.match('Wrap Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Wrap instance if not logged in', function(done) {
		agent.post('/wraps')
			.send(wrap)
			.expect(401)
			.end(function(wrapSaveErr, wrapSaveRes) {
				// Call the assertion callback
				done(wrapSaveErr);
			});
	});

	it('should not be able to save Wrap instance if no name is provided', function(done) {
		// Invalidate name field
		wrap.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wrap
				agent.post('/wraps')
					.send(wrap)
					.expect(400)
					.end(function(wrapSaveErr, wrapSaveRes) {
						// Set message assertion
						(wrapSaveRes.body.message).should.match('Please fill Wrap name');
						
						// Handle Wrap save error
						done(wrapSaveErr);
					});
			});
	});

	it('should be able to update Wrap instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wrap
				agent.post('/wraps')
					.send(wrap)
					.expect(200)
					.end(function(wrapSaveErr, wrapSaveRes) {
						// Handle Wrap save error
						if (wrapSaveErr) done(wrapSaveErr);

						// Update Wrap name
						wrap.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Wrap
						agent.put('/wraps/' + wrapSaveRes.body._id)
							.send(wrap)
							.expect(200)
							.end(function(wrapUpdateErr, wrapUpdateRes) {
								// Handle Wrap update error
								if (wrapUpdateErr) done(wrapUpdateErr);

								// Set assertions
								(wrapUpdateRes.body._id).should.equal(wrapSaveRes.body._id);
								(wrapUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Wraps if not signed in', function(done) {
		// Create new Wrap model instance
		var wrapObj = new Wrap(wrap);

		// Save the Wrap
		wrapObj.save(function() {
			// Request Wraps
			request(app).get('/wraps')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Wrap if not signed in', function(done) {
		// Create new Wrap model instance
		var wrapObj = new Wrap(wrap);

		// Save the Wrap
		wrapObj.save(function() {
			request(app).get('/wraps/' + wrapObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', wrap.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Wrap instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wrap
				agent.post('/wraps')
					.send(wrap)
					.expect(200)
					.end(function(wrapSaveErr, wrapSaveRes) {
						// Handle Wrap save error
						if (wrapSaveErr) done(wrapSaveErr);

						// Delete existing Wrap
						agent.delete('/wraps/' + wrapSaveRes.body._id)
							.send(wrap)
							.expect(200)
							.end(function(wrapDeleteErr, wrapDeleteRes) {
								// Handle Wrap error error
								if (wrapDeleteErr) done(wrapDeleteErr);

								// Set assertions
								(wrapDeleteRes.body._id).should.equal(wrapSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Wrap instance if not signed in', function(done) {
		// Set Wrap user 
		wrap.user = user;

		// Create new Wrap model instance
		var wrapObj = new Wrap(wrap);

		// Save the Wrap
		wrapObj.save(function() {
			// Try deleting Wrap
			request(app).delete('/wraps/' + wrapObj._id)
			.expect(401)
			.end(function(wrapDeleteErr, wrapDeleteRes) {
				// Set message assertion
				(wrapDeleteRes.body.message).should.match('User is not logged in');

				// Handle Wrap error error
				done(wrapDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Wrap.remove().exec();
		done();
	});
});