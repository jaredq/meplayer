'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'mean';
	var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('articles');

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('core');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('local');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('platinum');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('player');

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('wraps');
'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
	}
]);
'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html'
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		});
	}
]);
'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$rootScope', '$stateParams',
	'$location', 'Authentication', 'Articles',
	function($scope, $rootScope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		// Create new Article
		$scope.create = function() {
			// Create new Article object
			var article = new Articles({
				title: this.title,
				content: this.content,
				type: this.type
			});

			// Redirect after save
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				// Clear form fields
				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Article
		$scope.remove = function(article) {
			if (!confirm('Remove it?'))
			{
				return;
			}
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		// Update existing Article
		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Articles
		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		// Find existing Article
		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};

		$scope.playIt = function(article) {
			$rootScope.$broadcast('playit', {content: article.content, type: article.type});
		};
	}
]);

'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Core module config
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Home', 'home', 'item', '/home?');
	}
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('root', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		}).
		state('home', {
			url: '/home',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Local module config
angular.module('local').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Local', 'local', 'item', '/local?');
	}
]);
'use strict';

//Setting up route
angular.module('local').config(['$stateProvider',
	function($stateProvider) {
		// Local state routing
		$stateProvider.
		state('local', {
			url: '/local',
			templateUrl: 'modules/local/views/local.client.view.html'
		});
	}
]);
'use strict';
/*global MediaElement, $*/

angular.module('local').controller('LocalController', ['$scope',
	function($scope) {
	}
]);
'use strict';

// Player module config
angular.module('player').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Player', 'player', 'item', '/player?');
	}
]);

'use strict';

//Setting up route
angular.module('player').config(['$stateProvider',
	function($stateProvider) {
		// Player state routing
		$stateProvider.
		state('player', {
			url: '/player',
			templateUrl: 'modules/player/views/player.client.view.html'
		});
	}
]);
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
		
		$scope.updateStatus = function(msg) {
			document.getElementById('me-player-status').innerHTML = msg;
		};
		
		$scope.mePlay = function() {
			console.debug('mePlay()');
			if ($scope.mePlayer && $scope.isPaused) {
				console.debug('mePlay():0');
				$scope.mePlayer.play();
			} else {
				console.debug('mePlay():1');
				$scope.meReady = false;
				$timeout(function() {
					$scope.meReady = true;
					$timeout(function() {$scope.initMePlayerAndPlay();}, 500);
				}, 500);
			}
			$scope.isPaused = false;
		};

		$scope.mePause = function() {
			console.debug('mePause()');
			if ($scope.mePlayer) {
				console.debug('mePause():0');
				$scope.mePlayer.pause();
				$scope.isPaused = true;
			}
		};

		$scope.meStop = function() {
			console.debug('meStop()');
			$scope.isPaused = false;
			$scope.meReady = false;
			if ($scope.mePlayer) {
				console.debug('meStop():0');
				$scope.mePlayer.pause();
				$scope.mePlayer.stop();
				$scope.mePlayer = null;
			}
		};

		$scope.startPlay = function() {
			$scope.updateStatus('loading ' + $scope.mediaUrl);
			console.debug($scope.mediaUrl);
			console.debug($scope.mediaType);

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

'use strict';

angular.module('player').directive('meFlashPlayer', [
	function() {
		return {
			restrict: 'A',
			scope: {
				report: '=',
			},
			templateUrl: 'modules/player/views/me-flash-player.client.view.html'
		};
	}
]);

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

'use strict';

angular.module('player').directive('mediaelementPlayer', ['$sce',
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
			templateUrl: 'modules/player/views/mediaelement-player.client.view.html'
		};
	}
]);

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

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window', function($window) {
	var auth = {
		user: $window.user
	};
	
	return auth;
}]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('wraps').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Wraps', 'wraps', 'dropdown', '/wraps(/create)?');
		Menus.addSubMenuItem('topbar', 'wraps', 'List Wraps', 'wraps');
		Menus.addSubMenuItem('topbar', 'wraps', 'New Wrap', 'wraps/create');
	}
]);
'use strict';

//Setting up route
angular.module('wraps').config(['$stateProvider',
	function($stateProvider) {
		// Wraps state routing
		$stateProvider.
		state('listWraps', {
			url: '/wraps',
			templateUrl: 'modules/wraps/views/list-wraps.client.view.html'
		}).
		state('createWrap', {
			url: '/wraps/create',
			templateUrl: 'modules/wraps/views/create-wrap.client.view.html'
		}).
		state('viewWrap', {
			url: '/wraps/:wrapId',
			templateUrl: 'modules/wraps/views/view-wrap.client.view.html'
		}).
		state('editWrap', {
			url: '/wraps/:wrapId/edit',
			templateUrl: 'modules/wraps/views/edit-wrap.client.view.html'
		});
	}
]);
'use strict';

// Wraps controller
angular.module('wraps').controller('WrapsController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Wraps',
	function($scope, $rootScope, $stateParams, $location, Authentication, Wraps) {
		$scope.authentication = Authentication;

		// Create new Wrap
		$scope.create = function() {
			// Create new Wrap object
			var wrap = new Wraps ({
				name: this.name,
				content: this.content,
				contentType: this.contentType
			});

			// Redirect after save
			wrap.$save(function(response) {
				$location.path('wraps/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Wrap
		$scope.remove = function(wrap) {
			if ( wrap ) { 
				wrap.$remove();

				for (var i in $scope.wraps) {
					if ($scope.wraps [i] === wrap) {
						$scope.wraps.splice(i, 1);
					}
				}
			} else {
				$scope.wrap.$remove(function() {
					$location.path('wraps');
				});
			}
		};

		// Update existing Wrap
		$scope.update = function() {
			var wrap = $scope.wrap;

			wrap.$update(function() {
				$location.path('wraps/' + wrap._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Wraps
		$scope.find = function() {
			$scope.wraps = Wraps.query();
		};

		// Find existing Wrap
		$scope.findOne = function() {
			$scope.wrap = Wraps.get({ 
				wrapId: $stateParams.wrapId
			});
		};

		$scope.playIt = function(wrap) {
			$rootScope.$broadcast('playit', {content: '/wrap-mmsh/' + wrap._id, type: 'application/x-mpegURL'});
		};
	}
]);
'use strict';

//Wraps service used to communicate Wraps REST endpoints
angular.module('wraps').factory('Wraps', ['$resource',
	function($resource) {
		return $resource('wraps/:wrapId', { wrapId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);