(function() {
	'use strict';

	angular
		.module('MemberPortal')
		.controller('SubmitFormController', SubmitFormController);

	/////////////////////

	SubmitFormController.$inject = ['$scope', '$state', '$stateParams', 'authService', 'errorCodesService'];

	function SubmitFormController( $scope, $state, $stateParams, authService, errorCodesService ) {

		$scope.form = {};
		$scope.submit = submit;
		$scope.filterQuestions = filterQuestions; //remove a selected question from remaining question selection

		init();

		//////////////////////////////////					Controller Functions

		function init() {
			$scope.$parent.current = 3;
			console.log('Handshake >', $scope.$parent.handshake); //security handshake between step 2 and 3, stored in Registration Controller
			if (!$scope.$parent.handshake.code) { //send straight back to step 1 if there is no handshake
//				$state.go('registration.registerForm');
			}
			$scope.form.QaPairs = [{}, {}, {}]; //create 3 security questions
			getQuestions();
		}

		function params() {
			return {
				SecurityCode: $scope.$parent.handshake.code,
				UserName: $scope.$parent.handshake.user,
				QaPairs: $scope.form.QaPairs
			};
		}

		function submit(validity) {
			if (validity) {
				console.log(params());
				authService.SubmitSecurityQuestions(params())
					.success(function(data) {
						console.log(data);
						$state.go('login', { referral: 'registration' });
					})
					.error(function(data) {
						console.log( data );
						$scope.alert = errorCodesService.registration( data ).msg;
					
					});
			} else {
				$scope.alert = 'Please properly fill out all inputs';
			}
		};

		function getQuestions() {
			authService.getAllQuestions()
				.success(function(data) {
					var fData = _.map(data, function(question) { // pull all questions from convoluted return object and place them all in a single array
						return {
							id: question.QuestionId,
							question: question.Question[0].question
						};
					});
//					console.log('Verify Questions >', data, 'Formatted >', fData);
					$scope.verifyQuestions = fData;
					filterQuestions();
					console.log($scope.verifyQuestions, $scope.remainingQuestions);
				})
				.error(function(data) {
					console.log(data);
				});
		}

		function filterQuestions() {
			$scope.selectedQuestions = _.map($scope.form.QaPairs, function(pair) { //put all selected question ids in an array for ease of parsing
				return parseInt(pair.QuestionId);
			});
		}

	}
})();