(function() {
	'use strict';

	var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
	var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

	angular
		.module('MemberPortalDirectives')
		.directive('progressiveRepeat', progressiveRepeat);

	progressiveRepeat.$inject = ['$compile'];

	function progressiveRepeat($compile) {
		var directive = {
			restrict: 'EA',
			transclude: 'true',
			scope: {
				results: '='
			},
			controller: controller,
			template: template,
			link: link
		};

		return directive;

		function template(tElement, tAttrs) {
			console.log(tAttrs.progressiveRepeat);
			return '<uib-progressbar class="detail-load" ng-show="loaded < 1" max="1" value="loaded" ng-animate="\'animate\'">' +
				'<span style="color: white; white-space: nowrap;"></span>' +
				'</uib-progressbar>' +
				'<ng-transclude love="' + tAttrs.progressiveRepeat + '"></ng-transclude>';
		}

		function link(scope, el, attr, ctrl, transclude) {
			return function ($scope) {
				transclude($scope, function (clone) {
					el.append(clone);
				});
			};
		}
	}

	controller.$inject = ['$scope', '$filter', 'searchTypeService', 'memberDataService', '$routeParams', '$interval'];

	function controller($scope, $filter, searchTypeService, memberDataService, $routeParams, $interval) {
		var lazyLoad = $interval(function() {
			if ($scope.delayLimit >= $scope.results.length) {
				$interval.cancel(lazyLoad);
			}
			$scope.delayLimit += 25;
			$scope.loaded = $scope.loaded <= 1 ? $scope.delayLimit / $scope.results.length : 1;
		}, 100);

	}
})();