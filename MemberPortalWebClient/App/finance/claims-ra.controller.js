(function() {
	'use strict';

	angular
		.module('MemberPortal')
		.controller('ClaimsRAController', ClaimsRAController);

	ClaimsRAController.$inject = ['$scope','$state', '$rootScope', '$translate', 'contentAuthorizationService', 'memberDataService', '$filter'];

	function ClaimsRAController($scope, $state,$rootScope, $translate, contentAuthorizationService, memberDataService, $filter) {

		authorizationDefaults();
		$scope.updateResults = updateResults;

		initSearch();
		updateResults();
		commonInit();


		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		function initSearch() {
			$scope.search = {};
			$scope.search.acceptedTypes = ['Check'];
			$scope.search.param = param;
			
			$scope.search.clickInput = clickInput;
			$scope.search.order = order;

			//options
			$scope.search.advancedFilter = 'dateRangeParam';
			$scope.search.reverse = true;
			$scope.search.days = 120;
			$scope.search.totalRows = null;
			$scope.search.currentPage = 1;
			$scope.search.pageSize = 25;
			$scope.search.predicate = null;
			$scope.search.submit = submit;
			$scope.search.updateFilters = updateFilters;
			$scope.search.validateRange = validateRange;
			$scope.search.rangeValue = 30;
			$scope.search.rangeOptions = {
				from: 1,
				to: 120,
				step: 1,
				smooth: true,
				realtime: true,
				css: {
					background: { "background-color": 'silver' },
					before: { "background-color": '#A6D0ED' },
					after: { "background-color": '#A6D0ED' },
					pointer: { "background-color": '#1671AE' }
				}
			};

			$scope.today = new Date();
			$scope.minCalendar = false;

			$scope.search.maxRange = moment().format('MM/DD/YYYY');
			$scope.search.minRange = moment().subtract($scope.search.days, 'days').format('MM/DD/YYYY');
			$scope.search.totalRange = moment($scope.search.maxRange).diff($scope.search.minRange, 'days');
		}

		//when user clicks on the search input, it disables date range filter
		function clickInput() {
			$scope.search.advancedFilter = null;
		}

		//whenever user changes search results by date range
		function updateResults() {
			//clear out search query to bring it out of focus 
			$scope.search.query = null;
			$scope.search.state = {};
			$scope.search.type = {};
			$scope.search.state.beganSearch = true;
			$scope.search.cachedParam = {};
			$scope.search.cachedParam.dateRangeParam = $scope.search.days;
			getResults($scope.search.param());
		}

		function validateRange(target) {
			//if you passed a target argument, it will check if the target is a valid date
			if (target) {
				return moment(target).isValid();
			} else {
				//if you did not pass any argument, it will determine the difference between the start and end date, and return if it is a valid range or not
				$scope.search.totalRange = moment($scope.search.maxRange).diff($scope.search.minRange, 'days');
				if ($scope.search.totalRange >= 0 && $scope.search.totalRange <= 120) {
					return true;
				} else if ($scope.search.totalRange < 0) {
					return 'Please choose a Start Date that begins before your End Date';
				} else if (!isNaN($scope.search.totalRange)) {
					return 'Please choose a date range within 120 days.';
				} else {
					return 'Please enter a valid date range.';
				}
			}
		}

		function getResults(param) {
			$scope.searchStatus = 1;
			memberDataService.GetRemittanceAdvice('GetClaimsRaListByDate', param).success(function(data) {
				$scope.search.cachedParam = {
					startDate: $scope.search.minRange,
					endDate: $scope.search.maxRange,
					//set advanced filter to displaywithindays by default if nothing else has been set yet
					advancedFilter: (!$scope.search.state.beganSearch) ? 'DateRangeParam' : null,
					totalRange: $scope.search.totalRange
				};
				$scope.searchStatus = 2;
				console.log('Success', data);
				$scope.search.results = data;
			}).error(error);
		}

		function error() {
			$scope.searchStatus = 0;
			$scope.errorMessage = $filter('translate')('form_unableToRetrieveData');
		}

		function order( predicate ) {
			$scope.search.status = 1;

			$scope.search.predicate !== predicate
		? ( $scope.search.reverse = false, $scope.search.predicate = predicate )
		: ( $scope.search.reverse = !$scope.search.reverse );

			var query = $scope.search.param();


			memberDataService.GetRemittanceAdvice( 'GetClaimsRaListByDate', query )
				.success( function ( data ) {
					console.log( 'Sorting by', query, data );
					$scope.search.results = data;
					$scope.search.totalRows = data[0].TotalRows;
				} )
				.error( function ( data ) {
					$scope.search.results = [];
					console.log( data );
					$scope.errorMessage = 'An issue occurred and your request cannot be processed.';
				} )
				.finally( function () {
					$scope.search.status = 2;
					$scope.search.state.beganSearch = false;
				} );
		}

		function param() {
			return {
				checkNumber: $scope.search.query ? $scope.search.query.replace(/\W/g, '') : null, //Remove extra characters
				//				dateRangeParam: parseInt($scope.search.days)
				startDate: $scope.search.minRange,
				endDate: $scope.search.maxRange,
				dateRangeParam: 0,
				modifier:  $scope.search.predicate || 'CheckDate',
				isDescending: $scope.search.reverse 

			};
		};

		function validated() {
			return $scope.search.type.string || !$scope.search.state.beganSearch;
		}

	

		function submit() {
			$scope.errorMessage = '';
			if ($scope.search.status !== 1 && validated()) {
				var endpoint = '';
				console.log('Retrieving', $scope.search.param());
				$scope.search.cachedParam = $scope.search.param();
				$scope.search.cachedParam.advancedFilter = $scope.search.advancedFilter;
				$scope.search.advancedFilter !== 'dateRangeParam'
					? endpoint = 'GetClaimsRaListByCheckNumber'
					: (endpoint = 'GetClaimsRaListByDate', $scope.search.query = null);
				$scope.search.status = 1;
				$scope.search.inputCollapsed = true;
				memberDataService.GetRemittanceAdvice(endpoint, $scope.search.param())
					.success(function(data) {
						console.log('Results', data);
						$scope.search.results = data;
						if (data.length) {
							$scope.search.totalRows = data[0].TotalRows;
						} else {
							$scope.search.totalRows = 0;
						}

					})
					.error(function(data) {
						$scope.search.results = [];
						$scope.search.inputCollapsed = false;
						console.log(data);
						$scope.errorMessage = $filter('translate')('form_unableToRetrieveData');
					})
					.finally(function() {
						$scope.search.status = 2;
						$scope.search.state.beganSearch = false;
					});
			} else {
				$scope.search.status = 3;
			}
		}

		function updateFilters(removedFilter) {
			var endpoint = '';
			$scope.search.status = 1;
			$scope.search.cachedParam[removedFilter] = null;
			if ($scope.search.cachedParam.advancedFilter === removedFilter) {
				$scope.search.cachedParam.advancedFilter = null;
			}
			if (removedFilter === 'checkNumber') {
				$scope.search.query = null;
				$scope.search.cachedParam.typeName = null;
				$scope.search.cachedParam.type = null;
				$scope.search.cachedParam.totalRange = $scope.search.totalRange;
			}
			//set advancedfilter to null instead of undefined so the page knows it's not the initial 'last 30 days' search
			if (typeof $scope.search.cachedParam.advancedFilter === 'undefined') {
				$scope.search.cachedParam.advancedFilter = null;
			}
			removedFilter === 'dateRangeParam' && $scope.search.cachedParam.checkNumber
				? (endpoint = 'GetClaimsRaListByCheckNumber')
				: (endpoint = 'GetClaimsRaListByDate');
			memberDataService.GetRemittanceAdvice(endpoint, $scope.search.cachedParam)
				.success(function(data) {
					console.log('Results', data);
					$scope.search.results = data;
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

		//COMMON PAGE INITIALIZATION 
		function commonInit() {
			$scope.errorMessage = '';
			$scope.infoMessage = '';
			$scope.successMessage = '';

			$scope.TestUserMode = $rootScope.TestUserMode;
			$scope.ShareDataWithState = 1; //On by default 
		}

		//CONTENT AUTHORIZATION DEFAULTS 
		function authorizationDefaults() {
			     $scope.siteItem = [];
			     $scope.siteItem = contentAuthorizationService.processContentAuth($state.$current.resolve.params[0]().CGC);

		}

	};

})();