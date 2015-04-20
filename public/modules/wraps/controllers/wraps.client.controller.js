'use strict';

// Wraps controller
angular.module('wraps').controller('WrapsController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Wraps',
	function($scope, $rootScope, $stateParams, $location, Authentication, Wraps) {
		$scope.authentication = Authentication;

		// Create new Wrap
		$scope.create = function() {
			// Create new Wrap object
			var wrap = new Wraps ({
				name: this.name,
				content: this.content,
				contentType: this.contentType
			});

			// Redirect after save
			wrap.$save(function(response) {
				$location.path('wraps/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Wrap
		$scope.remove = function(wrap) {
			if ( wrap ) { 
				wrap.$remove();

				for (var i in $scope.wraps) {
					if ($scope.wraps [i] === wrap) {
						$scope.wraps.splice(i, 1);
					}
				}
			} else {
				$scope.wrap.$remove(function() {
					$location.path('wraps');
				});
			}
		};

		// Update existing Wrap
		$scope.update = function() {
			var wrap = $scope.wrap;

			wrap.$update(function() {
				$location.path('wraps/' + wrap._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Wraps
		$scope.find = function() {
			$scope.wraps = Wraps.query();
		};

		// Find existing Wrap
		$scope.findOne = function() {
			$scope.wrap = Wraps.get({ 
				wrapId: $stateParams.wrapId
			});
		};

		$scope.playIt = function(wrap) {
			$rootScope.$broadcast('playit', '/wrap-mmsh/' + wrap._id);
		};
	}
]);