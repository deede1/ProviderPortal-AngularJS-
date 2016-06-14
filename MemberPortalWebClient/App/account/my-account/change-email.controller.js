(function() { 
	'use strict';

	angular
		.module('MemberPortal')
		.controller( 'ChangeEmailController', ChangeEmailController );

	/////////////////////

	ChangeEmailController.$inject = ['$scope', '$state', 'authService', 'authStatusService', 'errorCodesService'];

	function ChangeEmailController( $scope, $state, authService, authStatusService, errorCodesService ) {

		$scope.alert = {};
		$scope.form = {};
		$scope.changePasswordForm = {};
		$scope.submit = submit;
		init();

		//////////////////////////////////					Controller Functions
         
		function init() {

		}

		function param() {
			return {
				"UserName": authStatusService.getStatus().claims.username,
				"Password": $scope.form.password,
				"NewEmail": $scope.form.newEmail,
				"ConfirmEmail": $scope.form.chkNewEmail,
				"name": "ProviderPortal"
			};
		}

		function submit( formName ) {
			$scope.alert = {}; //clear alerts
			if (formName.$valid) {
				$scope.loader = true;
				console.log('Params >', param());

				authService.ChangeEmail(param())
					.success(function(data) {
						console.log(data);
						$scope.alert.success = 'Success! Your email has been updated.';
					})
					.error(function(data) {
						console.log(data);
//						$scope.alert.warning = errorCodesService.registration(data).alert ? errorCodesService.registration(data).msg : 'Please properly fill out all inputs';
						//						$scope.error = errorCodesService.registration(data).code;
						$scope.error = true;
					})
					.finally(function() {
						$scope.$parent.loader = false;
					});
			}
		};

	}
})();