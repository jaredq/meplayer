'use strict';

// Local module config
angular.module('local').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Local', 'local', 'item', '/local?');
	}
]);