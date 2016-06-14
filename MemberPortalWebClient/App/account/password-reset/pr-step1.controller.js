(function() {
	'use strict';

	angular
		.module('MemberPortal')
		.controller( 'PrStep1Controller', PrStep1Controller );

	/////////////////////

	PrStep1Controller.$inject = ['$scope', '$state', 'authService', 'errorCodesService'];

	function PrStep1Controller( $scope, $state, authService, errorCodesService ) {

		$scope.alert = '';
		$scope.form = {};
		$scope.form2 = {};
		$scope.submit = submit;
		init();

		//////////////////////////////////					Controller Functions

		function init() {
			$scope.$parent.current = 1;
		}

		function param() {
			return {
				Username: $scope.form.username,  
				EmailAddress: $scope.form.email
			};
		}

		function submit(validity) {
			if (validity.$valid) {
				$scope.$parent.loader = true;
				console.log('Params >', param());

				authService.ResetPassword(param())
					.success(function(data) {
						console.log(data);
						$state.go('password-reset.step2');
					})
					.error(function(data) {
						console.log(data);
						$scope.alert = errorCodesService.registration(data).alert ? errorCodesService.registration(data).msg : 'Please verify you have entered a valid email and username.';
						$scope.error = errorCodesService.registration(data).code;
					})
					.finally(function() {
						$scope.$parent.loader = false;
					});
			}
		};

	}
})();