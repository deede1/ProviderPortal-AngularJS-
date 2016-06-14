(function() {
	'use strict';

	angular
		.module('MemberPortalServices', ['ui.bootstrap', 'LocalStorageModule', 'ngResource'])
		.config(config);

	config.$inject = ['localStorageServiceProvider'];

	function config(localStorageServiceProvider) {
		localStorageServiceProvider
			.setStorageType('sessionStorage');

		localStorageServiceProvider
			.setStorageCookie(45, '/');
	}
})();