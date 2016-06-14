(function() {
	'use strict';

	angular
		.module('MemberPortal')
		.controller('PrStep3Controller', PrStep3Controller);

	/////////////////////

	PrStep3Controller.$inject = ['$scope', '$state', '$stateParams', 'authService', 'errorCodesService'];

	function PrStep3Controller($scope, $state, $stateParams, authService, errorCodesService) {

		$scope.form = {};
		$scope.selQuestion = null;
		$scope.submit = submit;

		init();

		//////////////////////////////////					Controller Functions

		function init() {
			$scope.$parent.current = 3;
			console.log('Handshake >', $scope.$parent.handshake); //security handshake between step 2 and 3, stored in Registration Controller
			if (!$scope.$parent.handshake.SecurityCode) { //send straight back to step 1 if there is no handshake
				$state.go('password-reset');
			}
			$scope.selQuestion = Math.floor((Math.random() * 3)) || getQuestion();
		}

		function params() {
			return {
				SecurityCode: $scope.$parent.handshake.SecurityCode,
				UserName: $scope.$parent.handshake.UserName,
				QuestionId: $scope.$parent.handshake.QaPairs[$scope.selQuestion].QuestionId,
				Answer: $scope.form.answer
			};  
		}

		function submit(validity) {
			if (validity.$valid) {
				console.log(params());
				authService.ConfirmSecurityQuestions(params())
					.success(function(data) {
						$scope.$parent.handshake.step4 = data;
						console.log('Step 3 Handshake >',data);
						$state.go('password-reset.step4');
					})
					.error(function(data) {
						$scope.alert = errorCodesService.passwordReset(data).msg;
						$scope.error = errorCodesService.passwordReset(data).code;
						$scope.submitForm.$setPristine();
						$scope.submitForm.$setUntouched();
						$scope.selQuestion = getQuestion();
						console.log(data);
					});
			}
		};

		function getQuestion() { //randomize number from 1-3, and make sure there isn't 2 consecutive 
			var old = $scope.selQuestion,
					newNum = old;

			$scope.form.answer = null;
			while (newNum === old) {
				newNum = Math.floor((Math.random() * 3));
			}
			return newNum;
		}

	}
})();