'use strict';

angular.module('player').directive('meHtml5Player', [
	function() {
		return {
			restrict: 'A',
			scope: {
				report: '=',
			},
			templateUrl: 'modules/player/views/me-html5-player.client.view.html'
		};
	}
]);
