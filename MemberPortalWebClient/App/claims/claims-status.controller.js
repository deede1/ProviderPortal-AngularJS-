(function() {
	'use strict';

	angular
		.module('MemberPortal')
		.controller('ClaimsStatusController', ClaimsStatusController);
	//////////////////////////

	ClaimsStatusController.$inject = [
		'$scope', '$state', '$rootScope', '$translate', 'contentAuthorizationService', 'searchTypeService', 'memberDataService', 'authStatusService', '$filter'
	];

	function ClaimsStatusController($scope, $state, $rootScope, $translate, contentAuthorizationService, searchTypeService, memberDataService, authStatusService, $filter) {

		//returns true if user can search by check number	(managr has a weird spelling)
		$scope.canUseCheck = ['OWNER', 'MANAGR', 'BILLER'].indexOf(authStatusService.getStatus().claims.usertypeid) > -1;
		authorizationDefaults(); //Security First
		initSearch();
		getResults();
		commonInit();
		$scope.search.advancedFilter = null; //reset the filter to nothing after the initial page-load search that contains date range filter

		//////////////////////////////////////////////////////////////////////////  Controller Methods

		function getResults() {
			$scope.search.status = 1;
			$scope.search.cachedQuery = {
				startDate: $scope.search.minRange,
				endDate: $scope.search.maxRange,
				rowsPerPage: $scope.search.pageSize,
				totalRange: $scope.search.totalRange,
				sortByProperty: $scope.search.predicate,
				sortDescending: $scope.search.reverse,
				pageNumber: 1,
				//set advanced filter to displaywithindays by default if nothing else has been set yet
				advancedFilter: (!$scope.search.state.beganSearch) ? 'dateRange' : null
			};
			console.log($scope.search.cachedQuery);
			memberDataService.GetClaimStatus($scope.search.cachedQuery).success(function(data) {
				console.log('Results', data);
				if (data.ClaimStatusList.length) {
					$scope.search.totalRows = data.ClaimStatusList[0].TotalRows;
				} else {
					$scope.search.totalRows = 0;
				}
				$scope.search.status = 3;
				$scope.search.results = data.ClaimStatusList;
			}).error(function() {
				$scope.search.status = 2;
				$scope.errorMessage = $filter('translate')('form_unableToRetrieveData');
			});
		}

		function initSearch() {
			//init
			$scope.search = {};
			$scope.search.acceptedTypes = ['Claim', 'CIN', 'SSN', 'IEHPID'];
			if ($scope.canUseCheck) {
				$scope.search.acceptedTypes.push('Check');
			}
			$scope.search.status = false; //0 = No Search; 1 = Searching; 2 = Search Complete;
			$scope.search.results = [];
			$scope.alert = null; //is activated if user tries to search with no parameters
			$scope.search.query = null;

			$scope.search.type = searchTypeService.type($scope.query);
			$scope.search.param = param;

			//options
			$scope.search.advancedFilter = 'dateRange';
			$scope.search.displayWithinDays = 120;
			$scope.search.totalRows = null;
			$scope.search.currentPage = 1;
			$scope.search.pageSize = 25;
			$scope.search.predicate = 'LastName';
			$scope.search.reverse = false;
			$scope.search.selectedClaimID = '';
			$scope.search.detailsCache = [];
			$scope.search.state = {};

			//methods
			$scope.search.rowSelect = rowSelect;
			$scope.search.pageChanged = pageChanged;
			$scope.search.order = order;
			$scope.search.range = range;
			$scope.search.submit = submit;
			$scope.search.clear = clear;
			$scope.search.validateRange = validateRange;
			$scope.search.updateFilters = updateFilters;

			//date range init
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
			$scope.today = moment().format('MM/DD/YYYY');
			$scope.minCalendar = false;
			$scope.search.maxRange = moment().format('MM/DD/YYYY');
			$scope.search.minRange = moment().subtract($scope.search.displayWithinDays, 'days').format('MM/DD/YYYY');
			$scope.search.totalRange = moment($scope.search.maxRange).diff($scope.search.minRange, 'days');

			////////////////////////search methods

			//accordion effect
			function rowSelect(item) {
				//makes sure data isn't loading
				if (!_.some($scope.search.results, 'search.status', 1)) {
					//collapse search pane
					$scope.search.inputCollapsed = true;
					//collapse all items except current item
					_.forEach($scope.search.results, function(result) {
						result.expand = (result === item) ? !result.expand : false;
					});
					$scope.search.selectedClaimID = item.ClaimNumber;
					getClaimDetails(item);
				} else {
					console.log('Still loading');
				}

			}

			function getClaimDetails(item) {
				if ($scope.search.detailsCache[$scope.search.selectedClaimID] === undefined) {
					$scope.search.status = 1;
					memberDataService.GetClaimDetail($scope.search.selectedClaimID)
						.success(function(data) {
							$scope.search.detailsCache[$scope.search.selectedClaimID] = data;

							//since claims details is taken from the first index of the results, we will search if a CheckNumber exists in ANY
							//index (including the first index) and then add it to the first index. Otherwise, set CheckNumber to N/A
							var returnObject = _.find(data, function(line) { return line.CheckNumber !== 'N/A' }) || null;
							$scope.search.detailsCache[$scope.search.selectedClaimID][0].CheckNumber = returnObject ? returnObject.CheckNumber : 'N/A';
						})
						.error(function(data) {
							$scope.search.detailsCache[$scope.search.selectedClaimID] = null;
							console.log(data);
						}).finally(function() {
							$scope.search.status = 2;
							console.log('Cached claims > ', $scope.search.detailsCache);
						});
				}
			}

			function pageChanged() {
				var query = $scope.search.param();
				$scope.search.status = 1;
				//when you click on a different page, it overrides anything you currently have in the search input with the cached query
				_.merge(query, $scope.search.cachedQuery);
				query.sortByProperty = $scope.search.predicate;
				query.sortDescending = $scope.search.reverse;
				query.pageNumber = $scope.search.currentPage;
				memberDataService.GetClaimStatus(query)
					.success(function(data) {
						$scope.search.results = data.ClaimStatusList;
						$scope.search.totalRows = data.ClaimStatusList[0].TotalRows;
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

			function order(predicate) {
				$scope.search.predicate !== predicate
					? ($scope.search.reverse = false, $scope.search.predicate = predicate)
					: ($scope.search.reverse = !$scope.search.reverse);

				var query = $scope.search.cachedQuery;
				query.sortByProperty = $scope.search.predicate;
				query.sortDescending = $scope.search.reverse;
				query.pageNumber = $scope.search.currentPage;
				$scope.search.status = 1;

				memberDataService.GetClaimStatus(query)
					.success(function(data) {
						console.log('Sorting by', query, data);
						$scope.search.results = data.ClaimStatusList;
						$scope.search.totalRows = data.ClaimStatusList[0].TotalRows;
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

			function range() {
				var left = $scope.search.pageSize * ($scope.search.currentPage - 1) + 1;
				var right = ($scope.search.totalRows < $scope.search.currentPage * $scope.search.pageSize)
											? $scope.search.totalRows
											: $scope.search.currentPage * $scope.search.pageSize;
				return { left: left, right: right };
			}

			function updateFilters(removedFilter) {
				$scope.search.status = 1;
				$scope.search.query = null;
				$scope.search.type = {};
				$scope.search.cachedQuery[removedFilter] = null;
				if ($scope.search.cachedQuery.advancedFilter === removedFilter) {
					$scope.search.cachedQuery.advancedFilter = null;
				}
				if (removedFilter === 'value') {
					$scope.search.query = null;
					$scope.search.cachedQuery.typeName = null;
					$scope.search.cachedQuery.type = null;
					$scope.search.cachedQuery.value = null;
				}
				if (removedFilter === 'dateRange') {
					$scope.search.cachedQuery.startDate = null;
					$scope.search.cachedQuery.endDate = null;
					$scope.search.cachedQuery.advancedFilter = null;
					$scope.search.advancedFilter = null;
				}
				//set advancedfilter to null instead of undefined so the page knows it's not the initial 'last 30 days' search
				if (typeof $scope.search.cachedQuery.advancedFilter === 'undefined') {
					$scope.search.cachedQuery.advancedFilter = null;
				}


				if ($scope.search.cachedQuery.advancedFilter === null && !$scope.search.cachedQuery.value) {
					$scope.search.results = [];
					$scope.search.status = 2;
					$scope.search.state.beganSearch = false;
					$scope.alert = true;
					$scope.search.totalRows = -1;
					console.log('Resetting search');
				} else {
					$scope.errorMessage = '';
					memberDataService.GetClaimStatus($scope.search.cachedQuery)
						.success(function(data) {
							console.log('Results', data);
							$scope.search.results = data.ClaimStatusList;
							if (data.ClaimStatusList.length) {
								//store total number of results (totalRows)
								$scope.search.totalRows = data.ClaimStatusList[0].TotalRows;
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
			}

			function validateRange() {
				var max = moment($scope.search.maxRange).format('MM/DD/YY'),
						min = moment($scope.search.minRange).format('MM/DD/YY');
				$scope.search.totalRange = moment(max).diff(moment(min), 'days');
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

			function param() {
				return {
					value: $scope.search.query ? $scope.search.query.replace(/\W/g, '') : null, //Remove extra characters
					type: $scope.search.query ? $scope.search.type.num : null,
					sortByProperty: $scope.search.predicate || null,
					pageNumber: $scope.search.currentPage || 1,
					rowsPerPage: $scope.search.pageSize || 50,
					sortDescending: $scope.search.reverse,
					displayWithinDays: $scope.search.advancedFilter === 'displayWithinDays' ? parseInt($scope.search.displayWithinDays) : null,
					startDate: (!$scope.search.query || $scope.search.advancedFilter === 'dateRange') ? $scope.search.minRange : null, //also pass dates if query is empty
					endDate: (!$scope.search.query || $scope.search.advancedFilter === 'dateRange') ? $scope.search.maxRange : null
				};
			};

			function clear() {
				$scope.search.query = null;
				$scope.search.type = {};
				$state.reload();
//				getResults();
			}


			function validated() {
				return $scope.search.type.string || !$scope.search.state.beganSearch || !$scope.search.query;
			}

			function submit() {
				if (!$scope.search.query && !$scope.search.advancedFilter) {
					$scope.search.results = [];
					$scope.alert = true;
				}
				$scope.errorMessage = '';
				if ($scope.search.status !== 1 && validated() && ($scope.search.query || $scope.search.advancedFilter)) {

					$scope.search.results = [];
					$scope.search.currentPage = 1;
					console.log('Retrieving', $scope.search.param());

					if ($scope.search.type.string || !$scope.search.query) { //check if valid search type or if searching only by date range
						$scope.search.status = 1;
						switch ($scope.search.type.string) {
						case 'SSN':
							$scope.search.predicate = 'PrimaryDateOfService';
							$scope.search.reverse = true;
							break;
						case 'Check':
							$scope.search.predicate = 'LastName';
							$scope.search.reverse = false;
							break;
						case 'Claim':
							$scope.search.predicate = 'LastName';
							$scope.search.reverse = false;
							break;
						case 'IEHPID':
							$scope.search.predicate = 'PrimaryDateOfService';
							$scope.search.reverse = true;
							break;
						case 'CIN':
							$scope.search.predicate = 'PrimaryDateOfService';
							$scope.search.reverse = true;
							break;
						default:
							$scope.search.predicate = 'PrimaryDateOfService';
							$scope.search.reverse = true;
						}
						memberDataService.GetClaimStatus($scope.search.param())
							.success(function(data) {
								$scope.alert = false;
								//cache query so when you use pagination, it'll remain the same query regardless of if you changed the input box
								$scope.search.cachedQuery = $scope.search.param();
								//add typeName because param() doesn't contain the type string by default
								$scope.search.cachedQuery.typeName = $scope.search.type.string;
								$scope.search.cachedQuery.advancedFilter = $scope.search.advancedFilter;
								$scope.search.cachedQuery.totalRange = $scope.search.totalRange;

								console.log('Results', data);
								$scope.search.results = data.ClaimStatusList;
								if (data.ClaimStatusList[0].MemberNumber) { //check if there is at least one valid result
									//store total number of results (totalRows)
									$scope.search.totalRows = data.ClaimStatusList[0].TotalRows;
									getTotalCheck(data);
									$scope.search.inputCollapsed = true;
								} else {
									$scope.search.totalRows = 0;
									$scope.search.status = 2;
									$scope.search.state.beganSearch = false;
									$scope.search.inputCollapsed = false;
									console.log('Resetting search');
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
					$scope.search.totalRows = 0;
					$scope.search.results = [];

				}
			}

			function getTotalCheck(data) {
				$scope.search.totalCheck = data.CheckTotal;
			};
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