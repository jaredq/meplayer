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