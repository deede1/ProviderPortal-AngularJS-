(function() {
	'use strict';

	angular
		.module('MemberPortal')
		.controller('VerifyFormController', VerifyFormController);

	/////////////////////

	VerifyFormController.$inject = ['$scope', '$state', '$stateParams', '$timeout', 'authService', 'errorCodesService'];

	function VerifyFormController($scope, $state, $stateParams, $timeout, authService, errorCodesService) {

		$scope.alert = null;
		$scope.form = {};
		$scope.submit = submit;

		init();

		//////////////////////////////////					Controller Functions

		function init() {
			$scope.$parent.current = 2;
			$scope.userName = $stateParams.userName;
			$scope.form.verificationCode = $stateParams.verificationCode;
			if (!$scope.userName) { //send user back to register if there is no username in the parameters
				$state.go('registration.registerForm');
			}
			if ($scope.form.verificationCode) { //send straight to submission if there is a verification code in the url
				submit(true);
			}
		}

		function params() {
			return {
				verificationCode: $scope.form.verificationCode,
				userName: $scope.userName //$scope.form.TaxId
			};
		}

		function submit(validity) {
			if (validity) {
				console.log(params());
				authService.VerifyEmailCode(params())
					.success(function(data) {
						console.log(data);
						$scope.$parent.handshake.user = $scope.userName; //security handshake between step 2 and 3, stored in Registration Controller
						$scope.$parent.handshake.code = data;
						$state.go('registration.submitForm');
					})
					.error(function(data) {
						console.log(data);
						$scope.alert = 'Verification Code is not valid or has expired. Please start over from Step 1.';
					});
			} else {
				$scope.alert = 'Please properly fill out all inputs';
			}
		};

	}
})();