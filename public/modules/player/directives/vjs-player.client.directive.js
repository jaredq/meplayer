'use strict';

angular.module('player').directive('vjsPlayer', ['$sce',
	function($sce) {
		return {
			link: function(scope, element, attributes){
				scope.mediaType = attributes.mediaType;
				scope.mediaUrl = attributes.mediaUrl;
				
				scope.trustSrc = function(src) {
					return $sce.trustAsResourceUrl(src);
				};
			},
			restrict: 'A',
			scope: {
			},
			templateUrl: 'modules/player/views/vjs-player.client.view.html'
		};
	}
]);
