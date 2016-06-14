(function () {
    'use strict';

    angular
		.module('MemberPortal')
		.controller('bhController', bhController);

    bhController.$inject = ['$scope', '$rootScope', '$filter',
        '$state', '$stateParams', 'contentAuthorizationService',
        'memberDataService', '$translate'];

    function bhController($scope, $rootScope, $filter,
        $state, $stateParams, contentAuthorizationService,
            memberDataService, $translate) {

        console.log('@@bhController');

        $scope.serverPrefix = "https://www.iehp.org/Secure_Site"; //Normal
        $scope.serverPrefix = "https://internettest08.iehp.org/SecureSite_test";  // For Internal Access 
          
        $scope.IFRAME_PAGE_URL_BEHAVIORALHEALTH_CLAIMS = $scope.serverPrefix + "/BehavioralHealth/Claims/Forms/MbrInfo.asp";
        $scope.IFRAME_PAGE_URL_BEHAVIORALHEALTH_MEMBERHISTORY = $scope.serverPrefix + "/BehavioralHealth/Forms/MemberHistory.asp";

    }
})();