'use strict';

angular.module('player').directive('vlcPlayer', [
	function() {
		return {
			restrict: 'A',
			scope: {
				report: '=',
			},
			templateUrl: 'modules/player/views/vlc-player.client.view.html'
		};
	}
]);
