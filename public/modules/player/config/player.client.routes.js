'use strict';

//Setting up route
angular.module('player').config(['$stateProvider',
	function($stateProvider) {
		// Player state routing
		$stateProvider.
		state('player', {
			url: '/player',
			templateUrl: 'modules/player/views/player.client.view.html'
		});
	}
]);