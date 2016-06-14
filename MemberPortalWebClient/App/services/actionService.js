(function() {
	'use strict';

	angular
		.module('MemberPortalServices')
		.factory('actionService', actionService);

	actionService.$inject = ['memberDataService'];

	function actionService(memberDataService) {
		var service = {};

		service.getUserActions = getUserActions;
		service.count = service.count || 0;

		return service;

		/////////////////////////

		function getUserActions() {
			memberDataService.GetUserActions().success( function ( data ) {
				console.log('user actions >', data);
				service.actions = data;
				service.count = data.length;
				console.log(service.count);
			});
		}

	}
})();