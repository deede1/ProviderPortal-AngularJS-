(function() {
	'use strict';

	angular
		.module('MemberPortal')
		.controller('RegisterFormController', RegisterFormController);

	/////////////////////

	RegisterFormController.$inject = ['$scope', '$state', 'authService', 'errorCodesService', 'passwordRegex'];

	function RegisterFormController($scope, $state, authService, errorCodesService, passwordRegex) {

		$scope.alert = '';
		$scope.form = {};
		$scope.form2 = {};
		$scope.submit = submit;
		$scope.passwordRegex = passwordRegex;
		init();

		//////////////////////////////////					Controller Functions

		function init() {
			$scope.$parent.current = 1;
		}

		function param() {
			var param = {};
			if ($scope.providerType === 'contracted') {
				param = {
					IsContracted: true,
					ProviderId: $scope.form.ProviderId,
					TaxId: $scope.form.TaxId,
					EmailAddress: $scope.form.EmailAddress,
					Password: $scope.form.Password
				};
			} else {
				param = {
					IsContracted: false,
					UserName: $scope.form2.UserName,
					FacilityName: $scope.form2.FacilityName,
					FacilityType: $scope.form2.FacilityType,
					RegistrationReason: $scope.form2.RegistrationReason,
					Address: $scope.form2.Address,
					City: $scope.form2.City,
					State: $scope.form2.State,
					Zip: $scope.form2.Zip,
					Phone: $scope.form2.Phone,
					Fax: $scope.form2.Fax,
					EmailAddress: $scope.form2.EmailAddress,
					Password: $scope.form2.Password
				};
			}
			return param;
		}

		function submit(validity) {
			if (validity) {
				$scope.$parent.loader = true;
				console.log('Params >', param());
				var userName = ($scope.providerType === 'contracted') ? $scope.form.ProviderId : $scope.form2.UserName;
				authService.RegisterOwnerAccount(param())
					.success(function(data) {
						console.log(data);
						$state.go('registration.verifyForm', { userName: userName });
					})
					.error(function(data) {
						console.log(data);
						$scope.alert = errorCodesService.registration(data).msg;
						$scope.error = errorCodesService.registration(data).code;
					})
					.finally(function() {
						$scope.$parent.loader = false;
					});
			} else {
				$scope.alert = 'Please properly fill out all inputs';

			}
		};

	}
})();