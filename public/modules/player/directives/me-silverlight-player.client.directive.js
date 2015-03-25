'use strict';

angular.module('player').directive('meSilverlightPlayer', [
	function() {
		return {
			restrict: 'A',
			scope: {
				report: '=',
			},
			templateUrl: 'modules/player/views/me-silverlight-player.client.view.html'
		};
	}
]);
