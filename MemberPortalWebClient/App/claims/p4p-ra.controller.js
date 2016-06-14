(function() {
	'use strict';


	angular
		.module('MemberPortal')
		.controller('P4PRAController', P4PRAController);

	P4PRAController.$inject = ['$scope', '$rootScope', '$translate', 'contentAuthorizationService', '$state', 'memberDataService', '$filter', 'p4pRaMap'];

	function P4PRAController($scope, $rootScope, $translate, contentAuthorizationService, $state, memberDataService, $filter, p4pRaMap) {

		$scope.errorMessage = '';
		$scope.infoMessage = '';
		$scope.successMessage = '';

		$scope.TestUserMode = $rootScope.TestUserMode;
		$scope.ShareDataWithState = 1; //On by default 

	

		$scope.search = {};
		$scope.search.reverse = true;
		$scope.search.acceptedTypes = ['Check'];
		$scope.search.param = param;
//		$scope.search.api = memberDataService.GetRemittanceAdvice('GetAllP4PLists', $scope.search.param());
		$scope.search.clear = clear;
		$scope.search.order = order;

		//search options
		$scope.search.predicate = 'CheckDate';
		$scope.search.totalRows = null;
		$scope.search.currentPage = 1;
		$scope.search.pageSize = 25;
		$scope.search.submit = submit;
		$scope.search.updateFilters = updateFilters;

		$scope.current = 'p4pRA';
		getResults();


		////////////////

		function getResults() {
			$scope.searchStatus = 1;
			memberDataService.GetRemittanceAdvice('GetAllP4PLists').success(successInit).error(error);
		}

		function successInit(data) {
			console.log('Success', data);
			$scope.search.results = data;
			formatP4P(data);
			$scope.searchStatus = 2;
		}

		function error() {
			$scope.errorMessage = $filter('translate')('form_unableToRetrieveData');
			$scope.searchStatus = 0;
		}

		function formatP4P(data) {
			_.forEach(data, function(table) {
				table.fName = p4pRaMap[table.Name];
			});
		}

		function param() {
			return {
				checkNumber: $scope.search.query ? $scope.search.query.replace(/\W/g, '') : null, //Remove extra characters
				dateRangeParam: 0,
				modifier: $scope.search.predicate || 'CheckDate',
				isDescending: $scope.search.reverse,
				startDate: moment().subtract(365, 'days').format('YYYY-MM-DD'),
				endDate: moment().format('YYYY-MM-DD')
			};
		};

		function validated() {
			return $scope.search.type.string || !$scope.search.state.beganSearch;
		}

		function clear() {
			$scope.search.query = null;
			$scope.search.type = {};
			getResults();
		}

		function order(predicate) {
			$scope.search.status = 1;

			if ($scope.search.predicate !== predicate) {
				$scope.search.reverse = false;
				$scope.search.predicate = predicate;
			} else {
				$scope.search.reverse = !$scope.search.reverse;
			}


			var query = $scope.search.param();


			memberDataService.GetRemittanceAdvice('GetAllP4PLists', query)
				.success(function(data) {
					console.log('Sorting by', query, data);
					$scope.search.results = data;
					formatP4P(data);
					$scope.search.totalRows = data[0].TotalRows;
				})
				.error(function(data) {
					$scope.search.results = [];
					console.log(data);
					$scope.errorMessage = 'An issue occurred and your request cannot be processed.';
				})
				.finally(function() {
					$scope.search.status = 2;
					$scope.search.state.beganSearch = false;
				});
		}

		function submit() {
			$scope.errorMessage = '';
			if ($scope.search.status !== 1 && validated()) {
				$scope.search.inputCollapsed = true;
				$scope.search.cachedParam = $scope.search.param();
				console.log('Retrieving', $scope.search.param());
				if ($scope.search.type.string) { //check if valid search type
					$scope.search.status = 1;
					memberDataService.GetRemittanceAdvice('GetAllP4PLists', $scope.search.param())
						.success(function(data) {
							$scope.search.cachedParam = $scope.search.param();
							console.log('Results', data);
							$scope.search.results = data;
							formatP4P(data);
							if (data.length) {
								$scope.search.totalRows = data[0].TotalRows;
							} else {
								$scope.search.totalRows = 0;
							}

						})
						.error(function(data) {
							$scope.search.inputCollapsed = false;
							$scope.search.results = [];
							console.log(data);
							$scope.errorMessage = $filter('translate')('form_unableToRetrieveData');
						})
						.finally(function() {
							$scope.search.status = 2;
							$scope.search.state.beganSearch = false;
						});
				}
			} else {
				$scope.search.status = 3;
			}
		}

		function updateFilters() {
			$scope.search.query = null;
			$scope.search.cachedParam = null;
			getResults();
		}

		//========================= CONTENT AUTHORIZATION DEFAULTS  
		$scope.siteItem = [];
		$scope.siteItem = contentAuthorizationService.processContentAuth($state.$current.resolve.params[0]().CGC);

	}

})();