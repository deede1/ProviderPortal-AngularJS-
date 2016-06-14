(function () {
    'use strict';

    angular
		.module('MemberPortal')
		.controller('pharmController', pharmController);

    pharmController.$inject = ['$scope', '$rootScope', '$filter',
        '$state', '$stateParams', 'contentAuthorizationService',
        'memberDataService', '$translate'];

    function pharmController($scope, $rootScope, $filter,
        $state, $stateParams, contentAuthorizationService,
            memberDataService, $translate) {

        console.log('@@pharmController');

        $scope.serverPrefix = "https://www.iehp.org/Secure_Site"; //Normal
        $scope.serverPrefix = "https://internettest08.iehp.org/SecureSite_test";  // For Internal Access 

        $scope.IFRAME_PAGE_URL_PHARMACY_UPDATEYOURDIRECTORY = $scope.serverPrefix + "/PER/ProviderDirectoryUpdate.asp";
        $scope.IFRAME_PAGE_URL_PHARMACY_PERSTATUS = $scope.serverPrefix + "/PER/Scripts/Status1.asp";

    }
})();