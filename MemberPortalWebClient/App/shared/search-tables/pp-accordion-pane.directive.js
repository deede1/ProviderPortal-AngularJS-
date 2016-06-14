(function() {
	'use strict';

	/*
	Author: Long Dao

	Create a collapsible search input section. Upon search, it collapses the input like an accordion and the user can click on the header to expand it again

	Example:  	
	<div pp-accordion-pane="Claims Status Search" click="search.inputCollapsed"></div>

	Attributes: 
	click = the variable the directive will use to collapse or expand the input field. Set your click variable to true when making your AJAX call to collapse

*/

	var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
	var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

	angular
		.module('MemberPortalDirectives')
		.directive('ppAccordionPane', ppAccordionPane);

	function ppAccordionPane() {
		var directive = {
			restrict: 'A',
			templateUrl: urlBase + '/App/shared/search-tables/pp-accordion-pane.directive.html' + cacheBust,
			scope: {
				click: '='
			},
			link: link
		};

		return directive;

		/////////////////////////////////////////////////////
		function link($scope, el, attr) {
			$scope.label = attr.ppAccordionPane;
		}
	}

})();