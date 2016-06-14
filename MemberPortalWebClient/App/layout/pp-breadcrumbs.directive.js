(function() {
	'use strict';

	angular
		.module('MemberPortalDirectives')
		.directive('ppBreadcrumbs', ppBreadcrumbs);

	function ppBreadcrumbs() {
		var directive = {
			restrict: 'EA',
			require: '^nav',
			replace: true,
			scope: {
				title: '@'
			},
			template: '<ul id="breadcrumb">' +
				'<li><a ui-sref="home"><span class="glyphicon glyphicon-home"> </span></a></li>' +
				'<li><a>{{title}}</a></li>' +
				'</ul>'
		};

		return directive;

		//////////////////////
	}
})();