(function() { 
	'use strict';

	angular
		.module('MemberPortal')
		.controller('ChangeQuestionsController', ChangeQuestionsController);

	/////////////////////

	ChangeQuestionsController.$inject = ['$scope', '$state', 'authService', 'authStatusService', 'errorCodesService'];

	function ChangeQuestionsController($scope, $state, authService, authStatusService, errorCodesService) {

		$scope.alert = {};
		$scope.form = {};
		$scope.form.QaPairs = [{}, {}, {}];
		$scope.submit = submit;

		$scope.filterQuestions = filterQuestions; //remove a selected question from remaining question selection
		init();

		//////////////////////////////////					Controller Functions

		function init() {
			getQuestions();
		}

		function submit(formName) {
			$scope.alert = {}; //clear alerts
			if (formName.$valid) {
				$scope.loader = true;
				var params = {
					"UserName": authStatusService.getStatus().claims.username,
					"Password": $scope.form.password,
					"ApplicationName": 'ProviderPortal',
					"QaPairs": $scope.form.QaPairs
				};
				console.log('Params >', params);			 

				authService.ChangeSecurityQuestions( params )
					.success(function(data) {
						console.log(data);
						$scope.alert.success = 'Success! Your security questions have been updated.';
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

		function getQuestions() {
			$scope.loader = true;
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
				})
				.error(function(data) {
					console.log(data);
				})
				.finally(function() {
					$scope.loader = false;
				});
		}

		function filterQuestions() {
			$scope.selectedQuestions = _.map($scope.form.QaPairs, function(pair) { //put all selected question ids in an array for ease of parsing
				return parseInt( pair.questionId );
			});
		}

	}
})();