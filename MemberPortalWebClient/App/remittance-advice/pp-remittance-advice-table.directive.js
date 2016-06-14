(function() {
	'use strict';

	var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
	var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

	angular
		.module('MemberPortalDirectives')
		.directive('ppRemittanceAdviceTable', ppRemittanceAdviceTable);

	function ppRemittanceAdviceTable() {
		var directive = {
			restrict: 'EA',
			templateUrl: urlBase + '/App/remittance-advice/pp-remittance-advice-table.directive.html' + cacheBust,
			scope: {
				tableResults: '=results',
				tableName: '=tableName'
			},
			controller: controller

		};
		return directive;

		////////////////////////////////////


	}

	controller.$inject = ['$scope', '$filter', 'searchTypeService', 'memberDataService'];

	function controller($scope, $filter, searchTypeService, memberDataService) {
		$scope.search = $scope.$parent.search || {};
		$scope.search.selectedClaimID = '';
		$scope.search.detailsCache = [];

		$scope.search.rowSelect = rowSelect;
		$scope.search.pageChanged = pageChanged;
	
		$scope.search.range = range;

		/////////////////////////////////

		//accordion effect
		function rowSelect(item) {
			//makes sure data isn't loading
			if (!_.some($scope.search.results, 'search.status', 1)) {
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
				console.log('Retrieving Claim #', $scope.search.selectedClaimID);
				memberDataService.GetClaimDetail($scope.search.selectedClaimID)
					.success(function(data) {
						$scope.search.detailsCache[$scope.search.selectedClaimID] = data;
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
			$scope.search.status = 1;
			$scope.search.param.pageNumber = $scope.search.currentPage;
			memberDataService.GetClaimStatus($scope.search.param)
				.success(function(data) {
					$scope.search.results = data;
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



		function range() {
			var left = $scope.search.pageSize * ($scope.search.currentPage - 1) + 1;
			var right = ($scope.search.totalRows < $scope.search.currentPage * $scope.search.pageSize)
				? $scope.search.totalRows
				: $scope.search.currentPage * $scope.search.pageSize;
			return { left: left, right: right };
		}
	}
})();