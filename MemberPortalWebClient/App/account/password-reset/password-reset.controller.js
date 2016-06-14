(function() {
	'use strict';

	angular
		.module('MemberPortal')
		.controller('PasswordResetController', PasswordResetController);

	/////////////////////

	PasswordResetController.$inject = ['$scope', '$rootScope', 'authService'];

	function PasswordResetController($scope, $rootScope, authService) {

		$scope.current = 1; // the first form to show is step 1
		$scope.handshake = {}; //security handshake between step 2 and 3
		$scope.loader = false;
	}
})();  