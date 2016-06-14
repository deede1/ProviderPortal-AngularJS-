(function() {
	'use strict';

/*
	Author: Long Dao

	This transcludes the <td> row of a table. It displays a popover bubble upon hover

	Example:  	
	<td pp-table-tooltip="{{::longerDescription}}">{{::title}}</td>

	Attributes: 
	'pp-table-tooltip': The longer description that popsover upon hover of the table cell

	Assumptions:
	None
*/

	var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
	var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

	angular
		.module('MemberPortalDirectives')
		.directive('ppTableTooltip', ppTableTooltip);

	function ppTableTooltip() {
		var directive = {
			restrict: 'EA',
			replace: 'true',
			transclude: 'true',
			templateUrl: urlBase + '/App/shared/search-tables/pp-table-tooltip.directive.html' + cacheBust,
			scope: {},
			link: link
		};

		return directive;

		function link($scope, el, attr) {
			$scope.detail = attr.ppTableTooltip;
		}
	}

})();