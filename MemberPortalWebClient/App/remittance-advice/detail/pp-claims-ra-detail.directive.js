(function() {
	'use strict';

	var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
	var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

	angular
		.module('MemberPortalDirectives')
		.directive('ppClaimsRaDetail', ppClaimsRaDetail);

	function ppClaimsRaDetail() {
		var directive = {
			restrict: 'EA',
			templateUrl: urlBase + '/App/remittance-advice/detail/pp-claims-ra-detail.directive.html' + cacheBust,
			scope: false,
			controller: controller,
			compile: compile
		};

		return directive;

		function compile() {
			//remove header and footer from template
//			angular.element('header, footer').hide();
		}
	}

	controller.$inject = ['$scope', '$filter', 'searchTypeService', 'memberDataService', '$stateParams', '$interval', '$rootScope'];

	function controller($scope, $filter, searchTypeService, memberDataService, $stateParams, $interval, $rootScope) {
		//add back the header and footer when navigating away
		$rootScope.$on('$stateChangeStart',
			function(event, toState, toParams, fromState, fromParams) {
				angular.element('.headerNav, footer').show();
			});
		$scope.delayLimit = 20;
		$scope.loaded = 0;
		$scope.results = {};

		//////////////////////////////////////////////////////////////

		//replace list's codename with friendly list name
		var params = {
			// api wants the variables as integers
			CheckNumber: parseInt($stateParams.claimId),
			DateString: parseInt($stateParams.date)

		};
		$scope.searchStatus = 1;
		memberDataService.GetRemittanceAdvice('GetClaimsRaDetail', params).success(successInit).error(error);

		function successInit(data) {
			console.log('RESULT >',data);
			$scope.results = data;	
			//only load first couple results, and then add in a couple more every second
			//var lazyLoad = $interval(function() {
			//	if ($scope.loaded >= 1) {
			//		$scope.searchStatus = 2;
			//		$interval.cancel(lazyLoad);
			//	}
			//	$scope.delayLimit += 288;
			//	$scope.loaded = $scope.loaded <= 1 ? $scope.delayLimit / $scope.results.GroupedClaimsDetail.length : 1;
		    //}, 10);
		    $scope.searchStatus = 2;
		}

		function error() {
			$scope.searchStatus = 2;
			$scope.errorMessage = $filter('translate')('form_unableToRetrieveData');
		}

	}
})();