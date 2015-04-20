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