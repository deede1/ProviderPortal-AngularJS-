(function() {
	'use strict';

	angular
		.module('MemberPortal')
		.controller('SubUserAccountsController', SubUserAccountsController);  

	/////////////////////

	SubUserAccountsController.$inject = ['$scope', '$state', 'memberDataService', 'authService', 'passwordRegex'];

	function SubUserAccountsController( $scope, $state, memberDataService, authService, passwordRegex ) {

		$scope.loader = false;
		$scope.subAccountList = {};
		$scope.form = {};
		$scope.error = null;
		$scope.alert = {};
		$scope.addAccount = false;
		$scope.passwordRegex = passwordRegex;

		$scope.editAccount = {};
		$scope.editAccount.click = click;
		$scope.submitAdd = submitAdd;
		$scope.submitEdit = submitEdit;
		$scope.filterQuestions = filterQuestions; //remove a selected question from remaining question selection

		init();

		//////////////////////////////////					Controller Functions

		function click(account) {
			$scope.editAccount.form = {};
			$scope.editAccount.form.UserName = $scope.subAccountList[account].UserName || null;
			$scope.editAccount.form.FirstName = $scope.subAccountList[account].FirstName || null;
			$scope.editAccount.form.LastName = $scope.subAccountList[account].LastName || null;
			$scope.editAccount.form.RoleName = $scope.subAccountList[account].RoleName || null;
			$scope.editAccount.form.ActiveFlag = $scope.subAccountList[account].ActiveFlag;
			$scope.editAccount.form.EmailAddress = $scope.subAccountList[account].EmailAddress;
			$scope.editAccount.show = typeof account !== 'undefined';
		}

		function submitAdd(validity) {

			if (validity.$valid) {
				$scope.loader = true;
				$scope.error = null;
				memberDataService.AddSubAccount( $scope.form )
					.success(function(data) {
						console.log(data);
						$scope.alert.success = 'Success! Your sub user account has been updated.';
						$scope.editAccount.form = {};
						$scope.editForm.$setPristine();
						$scope.editForm.$setUntouched();
						$scope.addAccount = false;
						$scope.editAccount.show = false;
						getSubAccounts(); //reload accounts list
					})
					.error(function(data) {
						console.log(data);
						$scope.error = 'Login already exists';
					})
					.finally( function () {
						$scope.loader = false;
					});
			} else {

			}
		};

		function submitEdit(validity) {

			if (validity.$valid) {
				$scope.loader = true;
				memberDataService.UpdateSubAccount($scope.editAccount.form)
					.success(function(data) {
						console.log(data);
						$scope.alert.success = 'Success! Your sub user account has been created.';
						$scope.form = {};
						$scope.addForm.$setPristine();
						$scope.addForm.$setUntouched();
						$scope.form.QaPairs = [{}, {}, {}];
						$scope.addAccount = false;
						$scope.editAccount.show = false;
						getSubAccounts(); //reload accounts list
					})
					.error(function(data) {
						console.log(data);
					}).finally(function() {
						$scope.loader = false;
					});
			} else {

			}
		};

		function init() {
			$scope.loader = true;
			$scope.form.QaPairs = [{}, {}, {}]; //create 3 security questions
			getQuestions();
			getSubAccounts();
		}

		function getSubAccounts() {
			$scope.loader = true;
			memberDataService.GetSubAccounts()
				.success(function(data) {
					console.log('getSubAccounts >', data);
					$scope.subAccountList = data;
				})
				.finally(function() {
					$scope.loader = false;
				});
		}

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
				.finally( function () {
					$scope.loader = false;
				});
		}

		function filterQuestions() {
			$scope.selectedQuestions = _.map($scope.form.QaPairs, function(pair) { //put all selected question ids in an array for ease of parsing
				return parseInt(pair.QuestionId);
			});
		}


	}
})();