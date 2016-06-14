(function() {
	'use strict';

	angular
		.module('MemberPortal')
		.controller('RegistrationController', RegistrationController);

	/////////////////////

	RegistrationController.$inject = ['$scope', '$rootScope', 'authService'];

	function RegistrationController($scope, $rootScope, authService) {

		$scope.current = 1; // the first form to show is step 1
		$scope.handshake = {}; //security handshake between step 2 and 3
		$scope.loader = false;
	}
})();