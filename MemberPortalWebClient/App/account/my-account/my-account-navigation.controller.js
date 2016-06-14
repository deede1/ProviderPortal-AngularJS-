(function() {
	'use strict';

	angular
		.module('MemberPortal')
		.controller('MyAccountNavigationController', MyAccountNavigationController);

	/////////////////////

	MyAccountNavigationController.$inject = ['$scope', 'authStatusService'];

	function MyAccountNavigationController($scope, authStatusService) {
		$scope.isOwner = ['OWNER', 'MANAGR'].indexOf(authStatusService.getStatus().claims.usertypeid) > -1;
	}
})();  