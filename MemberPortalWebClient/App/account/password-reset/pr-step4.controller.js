(function() {
	'use strict';

	angular
		.module('MemberPortal')
		.controller('PrStep4Controller', PrStep4Controller);

	/////////////////////

	PrStep4Controller.$inject = ['$scope', '$state', '$stateParams', 'authService', 'passwordRegex'];

	function PrStep4Controller( $scope, $state, $stateParams, authService, passwordRegex ) {

		$scope.form = {};
		$scope.submit = submit;
		$scope.passwordRegex = passwordRegex;

		init();

		//////////////////////////////////					Controller Functions

		function init() {
			$scope.$parent.current = 4;
			console.log('Handshake >', $scope.$parent.handshake); //security handshake between step 2 and 3, stored in Registration Controller
			if (!$scope.$parent.handshake.step4) { //send straight back to step 1 if there is no handshake
				$state.go('password-reset');
			}
		}

		function param() {
			return {
				"UserName": $scope.$parent.handshake.UserName,
				"OldPassword": $scope.$parent.handshake.step4,
				"NewPassword": $scope.form.newPassword,
				"ConfirmPassword": $scope.form.chkNewPassword,
				"name": 'ProviderPortal'
			};  
		}

		function submit(formName) {
			if (formName.$valid) {
				$scope.loader = true;
				console.log('Params >', param());

				authService.ChangePassword(param())
					.success(function(data) {
						console.log(data);
						$state.go('login', { referral: 'changePassword' });
					})
					.error(function(data) {
						console.log(data);
						$scope.error = true;
						$scope.alert = "Account couldn't be activated at this time. Please contact IEHP Provider Services at (909) 890-2054.  You may also send email correspondence to ProviderServices@iehp.org";
					})
					.finally(function() {
						$scope.$parent.loader = false;
					});
			}
		};
	}
})();