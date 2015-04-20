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