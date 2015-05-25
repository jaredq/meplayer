'use strict';
/*global MediaElement, videojs, $*/

angular.module('player').controller('PlayerController', ['$scope', '$timeout', '$sce', 'Authentication', 'Menus',
	function($scope, $timeout, $sce, Authentication, Menus) {
		var ME = 'me', VLC = 'vlc', VJS = 'vjs';

		$scope.mediaTitle = '';
		$scope.mediaUrl = 'mms://208.43.60.70/hope-fm2';
		$scope.mediaType = 'audio/wma';
		$scope.mediaTime = '';
		$scope.playerType = ME;
		$scope.playerStatus = '';
		$scope.isPaused = false;

		$scope.mePlayer = null;
		$scope.meReady = true;
		$scope.vjsMediaType = $scope.mediaType;
		$scope.vjsPlayer = null;
		$scope.vjsReady = true;
		$scope.vlcPlayer = null;

		
		$scope.updateStatus = function(msg) {
			document.getElementById('player-status').innerHTML = msg;
		};
		
		$scope.clearPause = function() {
			$scope.isPaused = false;
		};

		$scope.isVlcReady = function() {
			return $scope.playerType === VLC;
		};

		$scope.isVjsReady = function() {
			return $scope.vjsReady && $scope.playerType === VJS;
		};

		$scope.isMeReady = function() {
			return $scope.meReady && $scope.playerType === ME;
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

		$scope.vjsPlay = function() {
			$scope.updateStatus('==>vjs loading ' + $scope.mediaUrl);
			console.debug('vjsPlay()');
			if ($scope.vjsPlayer && $scope.isPaused) {
				console.debug('vjsPlay():0');
				$scope.vjsPlayer.play();
			} else {
				console.debug('vjsPlay():1');
				$scope.vjsReady = false;
				$timeout(function() {
					$scope.vjsReady = true;
					$timeout(function() {
						$scope.initVjsPlayerAndPlay();
						}, 500);
				}, 500);
			}
			$scope.isPaused = false;
		};

		$scope.vjsPause = function() {
			$scope.updateStatus('==>vjs pausing');
			console.debug('vjsPause()');
			if ($scope.vjsPlayer) {
				console.debug('vjsPause():0');
				$scope.vjsPlayer.pause();
				$scope.isPaused = true;
			}
			$scope.updateStatus('==>vjs paused');
		};

		$scope.vjsStop = function() {
			$scope.updateStatus('==>vjs stopping');
			console.debug('vjsStop()');
			$scope.isPaused = false;
			$scope.vjsReady = false;
			if ($scope.vjsPlayer) {
				console.debug('vjsStop():0');
				$scope.vjsPlayer.pause();
				//$scope.vjsPlayer.stop();
				$scope.vjsPlayer = null;
			}
			$scope.updateStatus('==>vjs stopped');
		};

		$scope.startPlay = function() {
			$scope.updateStatus('loading ' + $scope.mediaUrl);
			console.debug($scope.mediaUrl);
			console.debug($scope.mediaType);
			if ($scope.playerType === ME) {
				$scope.mePlay();
			} else if ($scope.playerType === VJS) {
				$scope.vjsPlay();
			} else {
				var vlcPlayer = document.getElementById('vlc-player');
				if (vlcPlayer) {
					$scope.vlcPlayer = vlcPlayer;
					$scope.vlcPlay();
				}		
			}
		};

		$scope.pausePlay = function() {
			$scope.updateStatus('pausing...');
			if ($scope.playerType === ME) {
				$scope.mePause();
			} else if ($scope.playerType === VJS) {
				$scope.vjsPause();
			} else {
				var vlcPlayer = document.getElementById('vlc-player');
				if (vlcPlayer) {
					$scope.vlcPause();
				}
			}
		};

		$scope.stopPlay = function() {
			$scope.updateStatus('stopping...');
			if ($scope.playerType === ME) {
				$scope.meStop();
			} else if ($scope.playerType === VJS) {
				$scope.vjsStop();
			} else {
				var vlcPlayer = document.getElementById('vlc-player');
				if (vlcPlayer) {
					$scope.vlcStop();
				} 
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
		
		$scope.initVjsPlayerAndPlay = function() {
			// TODO 
			console.debug('initVjsPlayerAndPlay'); 
			$scope.vjsPlayer = videojs('vjs-player');
		};

		$scope.$watch('mediaType', function(newValue, oldValue) {
			if ($scope.mediaType === 'video/rtmp') {
				$scope.vjsMediaType = 'rtmp/mp4';
			} else {
			  $scope.vjsMediaType = $scope.mediaType;
			}
		});

		$scope.$on('playit', function(event, args){
			$scope.mediaUrl = args.content;
			$scope.mediaType = args.type;			
			$scope.startPlay();
		});
	}
]);
