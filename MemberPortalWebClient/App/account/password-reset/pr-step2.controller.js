(function() {
	'use strict';

	angular
		.module('MemberPortal')
		.controller('PrStep2Controller', PrStep2Controller);

	/////////////////////

	PrStep2Controller.$inject = ['$scope', '$state', '$stateParams', '$timeout', 'authService', 'errorCodesService'];

	function PrStep2Controller($scope, $state, $stateParams, $timeout, authService, errorCodesService) {

		$scope.alert = null;
		$scope.form = {};
		$scope.submit = submit;

		init();

		//////////////////////////////////					Controller Functions

		function init() {
			$scope.$parent.current = 2;

			if ($stateParams.verificationCode) { //send straight to submission if there is a verification code in the url
				submit(true);
			}
		}
            
		function params() {
			return {
				verificationCode: $stateParams.verificationCode,
				userName: $stateParams.userName //$scope.form.TaxId
			};
		}

		function submit(validity) {
			if (validity) {
				console.log(params());
				authService.ConfirmEmail( params() )
					.success(function(data) {
						console.log(data);
						$scope.$parent.handshake = data; //security handshake between step 2 and 3, stored in Password-reset Controller
						$state.go('password-reset.step3');
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