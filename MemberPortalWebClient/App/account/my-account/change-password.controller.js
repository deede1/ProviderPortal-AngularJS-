(function() {
	'use strict';

	angular
		.module('MemberPortal') 
		.controller('ChangePasswordController', ChangePasswordController);

	/////////////////////

	ChangePasswordController.$inject = ['$scope', '$state', 'authService', 'authStatusService', 'passwordRegex'];

	function ChangePasswordController( $scope, $state, authService, authStatusService, passwordRegex ) {

		$scope.alert = '';
		$scope.form = {};
		$scope.changePasswordForm = {};
		$scope.submit = submit;
		$scope.passwordRegex = passwordRegex;
		init();

		//////////////////////////////////					Controller Functions

		function init() {

		}

		function param() {
			return {
				"UserName": authStatusService.getStatus().claims.username,
				"OldPassword": $scope.form.oldPassword,
				"NewPassword": $scope.form.newPassword,
				"ConfirmPassword": $scope.form.chkNewPassword,
				"name": "ProviderPortal"
			};
		}

		function submit(formName) {
			if (formName.$valid) {
				$scope.loader = true;
				console.log('Params >', param());

				authService.ChangePassword(param())
					.success(function(data) {
						console.log( data );

						//This will log the user out, but It's not doing everything I want right now...
						authService.logOut();
						authStatusService.status = authStatusService.getStatus();
						$scope.isAuth = authStatusService.status.isAuth;
						$scope.userName = authStatusService.status.userName;
						//end logout 

						$state.go( 'login', { referral: 'changePassword' } );
					
					})
					.error(function(data) {
						console.log(data);
//						$scope.alert = 'Please properly fill out all inputs';
						$scope.error = true;
					})
					.finally(function() {
						$scope.$parent.loader = false;
					});
			} 
		};

	}
})();