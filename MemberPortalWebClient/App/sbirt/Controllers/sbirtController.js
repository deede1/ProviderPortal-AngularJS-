(function () {
    'use strict';

    angular
		.module('MemberPortal')
		.controller('sbirtController', sbirtController);

    sbirtController.$inject = ['$scope', '$rootScope', '$filter',
        '$state', '$stateParams', 'contentAuthorizationService',
        'memberDataService', '$translate'];

    function sbirtController($scope, $rootScope, $filter,
        $state, $stateParams, contentAuthorizationService,
            memberDataService, $translate) {

        console.log('@@sbirtController');

        $scope.serverPrefix = "https://www.iehp.org/Secure_Site"; //Normal
        $scope.serverPrefix = "https://internettest08.iehp.org/SecureSite_test";  // For Internal Access 

        $scope.IFRAME_PAGE_URL_SBIRT = $scope.serverPrefix + "/SBIRT/SBIRT.asp";

    }
})();