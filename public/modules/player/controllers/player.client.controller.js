'use strict';
/*global MediaElement*/

angular.module('player').controller('PlayerController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.mediaTitle = '';
		$scope.mediaUrl = '';
		$scope.mediaTime = '';
		$scope.mePlayer = null;
		$scope.meFlashPlayer = null;
		$scope.meHtml5Player = null;
		$scope.meSilverlightPlayer = null;
		$scope.mePlayerType = 'auto';

		$scope.updateStatus = function(msg) {
			document.getElementById('me-player-status').innerHTML = msg;
		};
		
		$scope.choosePlayer = function() {
			if ($scope.mePlayerType === 'flash') {
				$scope.updateStatus('==>flash loading ' + $scope.mediaUrl);
				$scope.mePlayer = $scope.meFlashPlayer;
			} else if ($scope.mePlayerType === 'silverlight') {
				$scope.updateStatus('==>silverlight loading ' + $scope.mediaUrl);
				$scope.mePlayer = $scope.meSilverlightPlayer;
			} else {
				$scope.updateStatus('==>html5 loading ' + $scope.mediaUrl);
				$scope.mePlayer = $scope.meHtml5Player;
			}
		}
		
		$scope.mePlay = function() {
			$scope.meStop();

			$scope.mePlayer.setSrc($scope.mediaUrl);
			$scope.mePlayer.load();
			$scope.mePlayer.play();
		};

		$scope.meStop = function() {
			if ($scope.mePlayer) {
				$scope.mePlayer.pause();
				$scope.mePlayer.stop();
			}
			if ($scope.meFlashPlayer) {
				$scope.meFlashPlayer.pause();
				$scope.meFlashPlayer.stop();
			}
			if ($scope.meHtml5Player) {
				$scope.meHtml5Player.pause();
				$scope.meHtml5Player.stop();
			}
			if ($scope.meSilverlightPlayer) {
				$scope.meSilverlightPlayer.pause();
				$scope.meSilverlightPlayer.stop();
			}
		};

		$scope.startPlay = function() {
			$scope.updateStatus('loading ' + $scope.mediaUrl);

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
				if ($scope.mePlayer) {
					$scope.mePlayer.pause();
					$scope.choosePlayer();
					$scope.mePlay();
				} else {
					$scope.initMePlayersAndPlay();
				}
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
				if ($scope.mePlayer) {
					$scope.meStop();
				}
				$scope.updateStatus('stop');
			}
		};

		$scope.initMePlayersAndPlay = function() {

			new MediaElement('me-flash-player', {
				// shows debug errors on screen
				enablePluginDebug: false,
				// remove or reorder to change plugin priority
				plugins: ['flash','silverlight'],
				// specify to force MediaElement to use a particular video or audio type
				type: '',
				// path to Flash and Silverlight plugins
				pluginPath: '/lib/mediaelement/build/',
				// name of flash file
				flashName: 'flashmediaelement.swf',
				// name of silverlight file
				silverlightName: 'silverlightmediaelement.xap',
				// default if the <video width> is not specified
				defaultVideoWidth: 0,
				// default if the <video height> is not specified
				defaultVideoHeight: 0,
				// overrides <video width>
				pluginWidth: -1,
				// overrides <video height>
				pluginHeight: -1,
				// rate in milliseconds for Flash and Silverlight to fire the timeupdate event
				// larger number is less accurate, but less strain on plugin->JavaScript bridge
				timerRate: 250,
				// method that fires when the Flash or Silverlight object is ready
				success: function (mediaElement, domObject) {

					$scope.meFlashPlayer = mediaElement;

					 // add event listener
					 mediaElement.addEventListener('timeupdate', function(e) {

						 $scope.updateStatus('===>flash: ' + mediaElement.currentTime);

					 }, false);

					if ($scope.mePlayerType === 'flash') {
						$scope.meFlashPlayer.setSrc($scope.mediaUrl);
						$scope.meFlashPlayer.load();
						$scope.meFlashPlayer.play();
						$scope.mePlayer = $scope.meFlashPlayer;
					}
				},
				// fires when a problem is detected
				error: function () {
					//$scope.updateStatus('Found error when init me-flash-player.');
				}
			});
			new MediaElement('me-html5-player', {
				// shows debug errors on screen
				enablePluginDebug: false,
				// remove or reorder to change plugin priority
				plugins: ['flash','silverlight'],
				// specify to force MediaElement to use a particular video or audio type
				type: '',
				// path to Flash and Silverlight plugins
				pluginPath: '/lib/mediaelement/build/',
				// name of flash file
				flashName: 'flashmediaelement.swf',
				// name of silverlight file
				silverlightName: 'silverlightmediaelement.xap',
				// default if the <video width> is not specified
				defaultVideoWidth: 0,
				// default if the <video height> is not specified
				defaultVideoHeight: 0,
				// overrides <video width>
				pluginWidth: -1,
				// overrides <video height>
				pluginHeight: -1,
				// rate in milliseconds for Flash and Silverlight to fire the timeupdate event
				// larger number is less accurate, but less strain on plugin->JavaScript bridge
				timerRate: 250,
				// method that fires when the Flash or Silverlight object is ready
				success: function (mediaElement, domObject) {

					$scope.meHtml5Player = mediaElement;

					 // add event listener
					 mediaElement.addEventListener('timeupdate', function(e) {

						 $scope.updateStatus('===>html5: ' + mediaElement.currentTime);

					 }, false);

					 if ($scope.mePlayerType === 'auto' || $scope.mePlayerType === 'html5') {
						$scope.meHtml5Player.setSrc($scope.mediaUrl);
						$scope.meHtml5Player.load();
						$scope.meHtml5Player.play();
					 	$scope.mePlayer = $scope.meHtml5Player;
                     }
				},
				// fires when a problem is detected
				error: function () {
					//$scope.updateStatus('Found error when init me-html5-player.');
				}
			});
			new MediaElement('me-silverlight-player', {
				// shows debug errors on screen
				enablePluginDebug: false,
				// remove or reorder to change plugin priority
				plugins: ['flash','silverlight'],
				// specify to force MediaElement to use a particular video or audio type
				type: '',
				// path to Flash and Silverlight plugins
				pluginPath: '/lib/mediaelement/build/',
				// name of flash file
				flashName: 'flashmediaelement.swf',
				// name of silverlight file
				silverlightName: 'silverlightmediaelement.xap',
				// default if the <video width> is not specified
				defaultVideoWidth: 0,
				// default if the <video height> is not specified
				defaultVideoHeight: 0,
				// overrides <video width>
				pluginWidth: -1,
				// overrides <video height>
				pluginHeight: -1,
				// rate in milliseconds for Flash and Silverlight to fire the timeupdate event
				// larger number is less accurate, but less strain on plugin->JavaScript bridge
				timerRate: 250,
				// method that fires when the Flash or Silverlight object is ready
				success: function (mediaElement, domObject) {

					$scope.meSilverlightPlayer = mediaElement;

					 // add event listener
					 mediaElement.addEventListener('timeupdate', function(e) {

						 $scope.updateStatus('===>silverlight: ' + mediaElement.currentTime);

					 }, false);

					 if ($scope.mePlayerType === 'silverlight') {
						$scope.meSilverlightPlayer.setSrc($scope.mediaUrl);
						$scope.meSilverlightPlayer.load();
						$scope.meSilverlightPlayer.play();
					 	$scope.mePlayer = $scope.meSilverlightPlayer;
                     }
				},
				// fires when a problem is detected
				error: function () {
					//$scope.updateStatus('Found error when init me-silverlight-player.');
				}
			});
		};

		$scope.$on('playit', function(event, content){
			$scope.mediaUrl = content;
			$scope.startPlay();
		});
	}
]);
