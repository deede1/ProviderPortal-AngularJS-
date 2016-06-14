(function () {
	var app = angular.module('MemberPortal');

	var urlBase = $('meta[name="ApplicationRoot"]').attr('content'),
			cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

	//use this helper function to minimize repeated code in the routes
	function url(url) {
		return urlBase + url + cacheBust;
	}


	app.directive('authorizationSearchResults', function () {
		return {
			scope: true,
			restrict: 'EA',
			require: '^authorizationSearch',
			templateUrl: url('/app/authorizations/authorization-search-results.directive.html'),
			link: function (scope, element, attrs, authStatus) {
				//Bind the data node to the AuthStatus.data node.
				scope.data = authStatus.data;
				scope.searchResults = authStatus.searchResults;
				scope.results = authStatus.results;
			}
		};
	});

})();