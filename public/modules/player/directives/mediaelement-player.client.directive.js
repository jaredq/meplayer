'use strict';

angular.module('player').directive('mediaelementPlayer', [
	function() {
		return {
			restrict: 'A',
			scope: {
				report: '=',
			},
			templateUrl: 'modules/player/views/mediaelement-player.client.view.html'
		};
	}
]);
