(function() {
	'use strict';

/*
	Author: Long Dao

	This transcludes the <th> row of a table. It is used to display which column is active and also if the results are displayed in reverse or normal sorting.

	Example:  	
	<th pp-sortable-table-header="PrimaryDateOfService" default>Primary DOS</th>
	<th pp-sortable-table-header="ReceivedDate">Received</th>
	<th pp-sortable-table-header="ProviderName">Provider</th>

	Attributes: 
	'pp-sortable-table-header': Variable name of the predicate to send to the endpoint
	'default': The default predicate that is selected upon load
	'order': The Method that fires off when the user clicks on the button. Default is $scope.$parent.search.order()
	'results': The data object that contains the current selected order. Default is $scope.$parent.search.results

	Assumptions:
	It will write directly to the parent controller $scope.search so you can access it outside of this 
	directive. The results will be displayed in $scope.search.results so you can ng-repeat it in your results table
*/


	var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
	var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

	angular
		.module('MemberPortalDirectives')
		.directive('ppSortableTableHeader', ppSortableTableHeader);

	function ppSortableTableHeader() {
		var directive = {
			restrict: 'A',
			replace: 'true',
			transclude: 'true',
			scope: true,
			templateUrl: urlBase + '/App/shared/search-tables/pp-sortable-table-header.directive.html' + cacheBust,
			link: {
				pre: preLink,
				post: postLink
			}
		};

		return directive;

		function preLink($scope, el, attr) {
			//set your own order method and result object if you want
			$scope.search.order = attr.order ? attr.order : $scope.search.order;
			$scope.search.results = attr.results ? attr.results : $scope.search.results;

			$scope.modifier = attr.ppSortableTableHeader;
			$scope.search.default = attr.default !== undefined;

			if ($scope.search.default) {
				$scope.search.predicate = $scope.modifier;
			}
		}

		function postLink($scope, el, attr) {
			el.bind('click', function() {
				$scope.search.order($scope.modifier);
				$scope.$apply();
			});
		}
	};
})();