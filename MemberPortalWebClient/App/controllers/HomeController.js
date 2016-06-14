(function() {
	'use strict';

	angular
		.module('MemberPortal')
		.controller('HomeController', HomeController);

	HomeController.$inject = ['$scope','$state', '$rootScope','$http', '$location', '$cookies', '$filter',
        '$translate', 'dialogs', 'memberDataService', 'localStorageService',
         'contentAuthorizationService'];

	function HomeController($scope,$state,  $rootScope,$http, $location, $cookies, $filter,
        $translate, $dialogs, memberDataService, localStorageService,
          contentAuthorizationService) {

	    console.log('@@==== HOMECONTROLLER1');
	          $scope.siteItem = [];
	          $scope.siteItem = contentAuthorizationService.processContentAuth($state.$current.resolve.params[0]().CGC);
	    console.log('@@==== HOMECONTROLLER2 NAV.ELIG:'+ $scope.siteItem['NAV.ELIG']);

	}
})();