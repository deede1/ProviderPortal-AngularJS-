(function() {
	'use strict';

	var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
	var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

	angular
		.module('MemberPortalDirectives')
		.directive('ppEligibilityDisclaimer', eligibilityDisclaimer );

	function eligibilityDisclaimer() {
		var directive = {
			restrict: 'EA',
			templateUrl: urlBase + '/App/directives/pp-eligibility-disclaimer/ppEligibilityDisclaimer.html' + cacheBust
		};

		return directive;
	}

})();