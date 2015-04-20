'use strict';

(function() {
	// Wraps Controller Spec
	describe('Wraps Controller Tests', function() {
		// Initialize global variables
		var WrapsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Wraps controller.
			WrapsController = $controller('WrapsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Wrap object fetched from XHR', inject(function(Wraps) {
			// Create sample Wrap using the Wraps service
			var sampleWrap = new Wraps({
				name: 'New Wrap'
			});

			// Create a sample Wraps array that includes the new Wrap
			var sampleWraps = [sampleWrap];

			// Set GET response
			$httpBackend.expectGET('wraps').respond(sampleWraps);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.wraps).toEqualData(sampleWraps);
		}));

		it('$scope.findOne() should create an array with one Wrap object fetched from XHR using a wrapId URL parameter', inject(function(Wraps) {
			// Define a sample Wrap object
			var sampleWrap = new Wraps({
				name: 'New Wrap'
			});

			// Set the URL parameter
			$stateParams.wrapId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/wraps\/([0-9a-fA-F]{24})$/).respond(sampleWrap);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.wrap).toEqualData(sampleWrap);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Wraps) {
			// Create a sample Wrap object
			var sampleWrapPostData = new Wraps({
				name: 'New Wrap'
			});

			// Create a sample Wrap response
			var sampleWrapResponse = new Wraps({
				_id: '525cf20451979dea2c000001',
				name: 'New Wrap'
			});

			// Fixture mock form input values
			scope.name = 'New Wrap';

			// Set POST response
			$httpBackend.expectPOST('wraps', sampleWrapPostData).respond(sampleWrapResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Wrap was created
			expect($location.path()).toBe('/wraps/' + sampleWrapResponse._id);
		}));

		it('$scope.update() should update a valid Wrap', inject(function(Wraps) {
			// Define a sample Wrap put data
			var sampleWrapPutData = new Wraps({
				_id: '525cf20451979dea2c000001',
				name: 'New Wrap'
			});

			// Mock Wrap in scope
			scope.wrap = sampleWrapPutData;

			// Set PUT response
			$httpBackend.expectPUT(/wraps\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/wraps/' + sampleWrapPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid wrapId and remove the Wrap from the scope', inject(function(Wraps) {
			// Create new Wrap object
			var sampleWrap = new Wraps({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Wraps array and include the Wrap
			scope.wraps = [sampleWrap];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/wraps\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleWrap);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.wraps.length).toBe(0);
		}));
	});
}());