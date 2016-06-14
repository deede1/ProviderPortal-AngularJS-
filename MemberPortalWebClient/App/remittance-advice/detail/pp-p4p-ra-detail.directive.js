(function() {
	'use strict';

	var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
	var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

	angular
		.module('MemberPortalDirectives')
		.directive('ppP4pRaDetail', ppP4pRaDetail);

	function ppP4pRaDetail() {
		var directive = {
			restrict: 'EA',
			templateUrl: urlBase + '/App/remittance-advice/detail/pp-p4p-ra-detail.directive.html' + cacheBust,
			scope: false,
			controller: controller,
			compile: compile
		};

		return directive;

		function compile() {
			//remove header and footer from template
			angular.element('.headerNav, footer').hide();
		}
	}

	controller.$inject = ['$scope', '$filter', 'searchTypeService', 'memberDataService', '$stateParams', '$interval', '$rootScope', 'p4pRaMap'];

	function controller($scope, $filter, searchTypeService, memberDataService, $stateParams, $interval, $rootScope, p4pRaMap) {
		//add back the header and footer when navigating away
		$rootScope.$on('$stateChangeStart',
			function(event, toState, toParams, fromState, fromParams) {
				angular.element('.headerNav, footer').show();
			});
		$scope.delayLimit = 20;
		$scope.loaded = 0;
		$scope.results = {};

		//replace list's codename with friendly list name
		$scope.tableName = _.get(p4pRaMap, $stateParams.list);
		var params = {
			recordNumber: parseInt($stateParams.claimId),
			type: $stateParams.list

		};
		console.log(params);
		memberDataService.GetRemittanceAdvice('GetP4PDetailRecord', params).success(successInit).error(error);

		////////////////////

		function successInit(data) {
			console.log(data, data.GroupedData.length);
			$scope.results = data;
			$scope.searchStatus = 1;
			//only load first couple results, and then add in a couple more every second
			var lazyLoad = $interval(function() {
				if ($scope.loaded >= 1) {
					$scope.searchStatus = 2;
					$interval.cancel(lazyLoad);
				}
				$scope.delayLimit += 288;
				$scope.loaded = $scope.loaded <= 1 ? $scope.delayLimit / $scope.results.GroupedData.length : 1;
			}, 10);
		}

		function error() {
			$scope.errorMessage = $filter('translate')('form_unableToRetrieveData');
		}

	}
})();