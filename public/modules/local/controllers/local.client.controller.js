'use strict';
/*global MediaElement, $*/

angular.module('local').controller('LocalController', ['$scope',
	function($scope) {		
		
		$scope.start = function() {
			$('video').mediaelementplayer({
				success: function(media, node, player) {
					$('#' + node.id + '-mode').html('mode: ' + media.pluginType);
				}
			});
		};
	}
]);