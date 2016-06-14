(function() {
	'use strict';

	angular
		.module('MemberPortalServices')
		.factory('alertService', alertService);

	function alertService() {
		var service = {
			error: error 
		};

		return service;

		/////////////////////////

		function error($filter) {
			return $filter('translate')('form_unableToRetrieveData');
		}

	}
})();