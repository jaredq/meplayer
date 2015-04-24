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
		$scope.isPaused = false;
		$scope.vlcPlayer = null;
		
		$scope.updateStatus = function(msg) {
			document.getElementById('me-player-status').innerHTML = msg;
		};
		
		$scope.clearPause = function() {
			$scope.isPaused = false;
		};

		$scope.vlcPlay = function() {
			$scope.updateStatus('==>vlc loading ' + $scope.mediaUrl);
			console.debug('vlcPlay()');
			var playlist = $scope.vlcPlayer.playlist;
			if (!$scope.isPaused) {
				console.debug('vlcPlay():0');
				playlist.stop();
				playlist.clear();
				playlist.add($scope.mediaUrl);
			}
			playlist.play();
			$scope.isPaused = false;
			$scope.updateStatus('==>vlc playing');
		};

		$scope.vlcPause = function() {
			$scope.updateStatus('==>vlc pausing');
			console.debug('vlcPause()');
			var playlist = $scope.vlcPlayer.playlist;
			playlist.pause();
			$scope.isPaused = true;
			$scope.updateStatus('==>vlc paused');
		};

		$scope.vlcStop = function() {
			$scope.updateStatus('==>vlc stopping');
			console.debug('vlcStop()');
			var playlist = $scope.vlcPlayer.playlist;
			playlist.stop();
			playlist.clear();
			$scope.isPaused = false;
			$scope.updateStatus('==>vlc stopped');
		};

		$scope.mePlay = function() {
			$scope.updateStatus('==>me loading ' + $scope.mediaUrl);
			console.debug('mePlay()');
			if ($scope.mePlayer && $scope.isPaused) {
				console.debug('mePlay():0');
				$scope.mePlayer.play();
			} else {
				console.debug('mePlay():1');
				$scope.meReady = false;
				$timeout(function() {
					$scope.meReady = true;
					$timeout(function() {
						$scope.initMePlayerAndPlay();
						}, 500);
				}, 500);
			}
			$scope.isPaused = false;
		};

		$scope.mePause = function() {
			$scope.updateStatus('==>me pausing');
			console.debug('mePause()');
			if ($scope.mePlayer) {
				console.debug('mePause():0');
				$scope.mePlayer.pause();
				$scope.isPaused = true;
			}
			$scope.updateStatus('==>me paused');
		};

		$scope.meStop = function() {
			$scope.updateStatus('==>me stopping');
			console.debug('meStop()');
			$scope.isPaused = false;
			$scope.meReady = false;
			if ($scope.mePlayer) {
				console.debug('meStop():0');
				$scope.mePlayer.pause();
				$scope.mePlayer.stop();
				$scope.mePlayer = null;
			}
			$scope.updateStatus('==>me stopped');
		};

		$scope.startPlay = function() {
			$scope.updateStatus('loading ' + $scope.mediaUrl);
			console.debug($scope.mediaUrl);
			console.debug($scope.mediaType);

			var vlcPlayer = document.getElementById('vlc-player');
			if (vlcPlayer) {
				$scope.vlcPlayer = vlcPlayer;
				$scope.vlcPlay();
			} else {
				$scope.mePlay();				
			}
		};

		$scope.pausePlay = function() {
			$scope.updateStatus('pausing...');
			var vlcPlayer = document.getElementById('vlc-player');
			if (vlcPlayer) {
				$scope.vlcPause();
			} else {
				$scope.mePause();
			}
		};

		$scope.stopPlay = function() {
			$scope.updateStatus('stopping...');
			var vlcPlayer = document.getElementById('vlc-player');
			if (vlcPlayer) {
				$scope.vlcStop();
			} else {
				$scope.meStop();
			}
		};
		
		$scope.initMePlayerAndPlay = function() {
			// TODO 
			console.debug('initMePlayerAndPlay');
			$('#me-player').mediaelementplayer({
				plugins: ['silverlight','flash','youtube','vimeo'],
				success: function (mediaElement, domObject, player) {
					console.debug('initMePlayerAndPlay-success');
					console.debug(mediaElement.pluginType);

					$scope.mePlayer = mediaElement;

					 // add event listener
					 mediaElement.addEventListener('timeupdate', function(e) {
						console.debug('initMePlayerAndPlay-timeupdate');
						$scope.updateStatus('===>' + mediaElement.pluginType + ': ' + mediaElement.currentTime);
					 }, false);
					 
					console.debug('initMePlayerAndPlay-success-end');
				},
				// fires when a problem is detected
				error: function () {
					console.debug('initMePlayerAndPlay-error');
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
