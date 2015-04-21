'use strict';
/*global MediaElement, $*/

angular.module('player').controller('PlayerController', ['$scope', '$timeout', '$sce', 'Authentication', 'Menus',
	function($scope, $timeout, $sce, Authentication, Menus) {
		$scope.mediaTitle = '';
		$scope.mediaUrl = 'mms://208.43.60.70/hope-fm2';
		$scope.mediaType = 'audio/x-ms-wma';
		$scope.mediaTime = '';
		$scope.mePlayer = null;
		$scope.meReady = true;
		
		$scope.updateStatus = function(msg) {
			document.getElementById('me-player-status').innerHTML = msg;
		};
		
		$scope.mePlay = function() {
			if ($scope.mePlayer) {
				$scope.mePlayer.play();
			} else {
				$scope.meReady = true;
				$timeout(function() {$scope.initMePlayerAndPlay();}, 500);
				
			}
		};

		$scope.mePause = function() {
			if ($scope.mePlayer) {
				$scope.mePlayer.pause();
			}
		};

		$scope.meStop = function() {
			$scope.meReady = false;
			if ($scope.mePlayer) {
				$scope.mePlayer.pause();
				$scope.mePlayer.stop();
				$scope.mePlayer = null;
			}
		};

		$scope.startPlay = function() {
			$scope.updateStatus('loading ' + $scope.mediaUrl);
			console.log($scope.mediaUrl);
			console.log($scope.mediaType);

			var vlcPlayer = document.getElementById('vlc-player');
			if (vlcPlayer) {
				$scope.updateStatus('==>vlc loading ' + $scope.mediaUrl);
				var playlist = vlcPlayer.playlist;
				playlist.stop();
				playlist.clear();
				playlist.add($scope.mediaUrl);
				playlist.play();
				$scope.updateStatus('==>vlc playing ' + $scope.mediaUrl);
			} else {
				$scope.updateStatus('starting...');
				$scope.mePlay();				
			}
		};

		$scope.pausePlay = function() {
			var vlcPlayer = document.getElementById('vlc-player');
			if (vlcPlayer) {
				var playlist = vlcPlayer.playlist;
				playlist.pause();
			} else {
				$scope.updateStatus('pausing...');
				$scope.mePause();
				$scope.updateStatus('paused');
			}
		};

		$scope.stopPlay = function() {
			var vlcPlayer = document.getElementById('vlc-player');
			if (vlcPlayer) {
				var playlist = vlcPlayer.playlist;
				playlist.stop();
				playlist.clear();
			} else {
				$scope.updateStatus('stopping...');
				$scope.meStop();
				$scope.updateStatus('stop');
			}
		};
		
		$scope.initMePlayerAndPlay = function() {
			// TODO 
			console.log('initMePlayerAndPlay');
			new MediaElement('me-player', {
				success: function (mediaElement, domObject, player) {
					console.log('initMePlayerAndPlay-success');
					console.log(mediaElement.pluginType);

					$scope.mePlayer = mediaElement;

					 // add event listener
					 mediaElement.addEventListener('timeupdate', function(e) {
						console.log('initMePlayerAndPlay-timeupdate');
						$scope.updateStatus('===>' + mediaElement.pluginType + ': ' + mediaElement.currentTime);
					 }, false);
					 
					console.log('initMePlayerAndPlay-success-end');
				},
				// fires when a problem is detected
				error: function () {
					console.log('initMePlayerAndPlay-error');
					$scope.updateStatus('error');
				}
			});
		};

		$scope.$on('playit', function(event, args){
			$scope.mediaUrl = args.content;
			$scope.mediaType = args.type;			
			$scope.startPlay();
		});
	}
]);
