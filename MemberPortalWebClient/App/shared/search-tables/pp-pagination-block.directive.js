(function() {
	'use strict';

	/*
	Author: Long Dao

	This is the block that contains pagination

	Example:  	
	<pp-pagination-block ng-show=" (search.totalRows > search.pageSize) "></pp-pagination-block>

	The directive also accepts transclusion to be displayed inside the pagination block. 
	<pp-pagination-block>
		<div class="pull-left">
			<strong class="pad20">Showing Claims Received In Last 30 Days</strong>
		</div>
	</pp-pagination-block>

	Attributes: 
	None

	Assumptions:
	It will write directly to the parent controller $scope.search (unless stated otherwise in the 'search' attr) so you can access it outside of this 
	directive. The results will be displayed in $scope.search.results so you can ng-repeat it in your results table
*/

	var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
	var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

	angular
		.module('MemberPortalDirectives')
		.directive('ppPaginationBlock', ppPaginationBlock);

	function ppPaginationBlock() {
		var directive = {
			restrict: 'EA',
			transclude: 'true',
			templateUrl: urlBase + '/App/shared/search-tables/pp-pagination-block.directive.html' + cacheBust,
			scope: {
				search: '=?'
			},
			link: link
		};

		return directive;

		function link($scope, el, attr) {
			$scope.search = $scope.search || $scope.$parent.search;
		}
	}

})();