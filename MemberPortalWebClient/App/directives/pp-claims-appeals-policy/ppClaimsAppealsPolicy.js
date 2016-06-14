(function() {
	'use strict';

	var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
	var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

	angular
		.module('MemberPortalDirectives')
		.directive('ppClaimsAppealsPolicy', ppClaimsAppealsPolicy);

	function ppClaimsAppealsPolicy() {
		var directive = {
			restrict: 'EA',
			templateUrl: urlBase + '/App/directives/pp-claims-appeals-policy/ppClaimsAppealsPolicy.html' + cacheBust
		};

		return directive;
	}

})();