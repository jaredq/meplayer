'use strict';

angular.module('player').directive('meFlashPlayer', [
	function() {
		return {
			restrict: 'A',
			scope: {
				report: '=',
			},
			templateUrl: 'modules/player/views/me-flash-player.client.view.html'
		};
	}
]);
