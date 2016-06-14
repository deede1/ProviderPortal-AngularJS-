(function () {
    'use strict';

    angular
		.module('MemberPortal')
		.controller('visionController', visionController);

    visionController.$inject = ['$scope', '$rootScope', '$filter',
        '$state', '$stateParams', 'contentAuthorizationService',
        'memberDataService', '$translate'];

    function visionController($scope, $rootScope, $filter,
        $state, $stateParams, contentAuthorizationService,
            memberDataService, $translate) {

        console.log('@@VISION-CONTROLLER');

        //iFrame Early Start Roster
        $scope.serverPrefix = "https://www.iehp.org/Secure_Site"; //Normal
        $scope.serverPrefix = "https://internettest08.iehp.org/SecureSite_test";  // For Internal Access 

        $scope.IFRAME_PAGE_URL_VISION_VER = $scope.serverPrefix + "/VER/Forms/MbrInfo.asp";
        $scope.IFRAME_PAGE_URL_VISION_VERS = $scope.serverPrefix + "/VER/Scripts/verstatus.asp";
        $scope.IFRAME_PAGE_URL_VISION_DIABETES = $scope.serverPrefix + "/P4P/Vision/scripts/Vision_M14.asp";
        $scope.IFRAME_PAGE_URL_VISION_ICD = $scope.serverPrefix + "/Vision/icd9/forms/search.asp";
    }

})();