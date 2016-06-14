(function () {
    'use strict';

    angular
		.module('MemberPortal')
		.controller('healthEducationController', healthEducationController);

    healthEducationController.$inject = ['$scope', '$rootScope', '$filter',
        '$state', '$stateParams', 'contentAuthorizationService',
        'memberDataService', '$translate'];

    function healthEducationController($scope, $rootScope, $filter,
        $state, $stateParams, contentAuthorizationService,
            memberDataService, $translate) {

        console.log('@@healthEducationController');

        $scope.serverPrefix = "https://www.iehp.org/Secure_Site"; //Normal
        $scope.serverPrefix = "https://internettest08.iehp.org/SecureSite_test";  // For Internal Access 

        $scope.IFRAME_PAGE_URL_HEALTHEDUCATION_REFERRALS = $scope.serverPrefix + "/HealthEd/Referrals/Scripts/MbrValidate.asp";
        $scope.IFRAME_PAGE_URL_HEALTHEDUCATION_REFERRALS_STATUS = $scope.serverPrefix + "/HealthEd/Referrals/Forms/Status.asp";

    }
})();