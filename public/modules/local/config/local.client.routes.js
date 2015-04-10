'use strict';

//Setting up route
angular.module('local').config(['$stateProvider',
	function($stateProvider) {
		// Local state routing
		$stateProvider.
		state('local', {
			url: '/local',
			templateUrl: 'modules/local/views/local.client.view.html'
		});
	}
]);