(function () {
    'use strict';

    angular
		.module('MemberPortal')
		.controller('hospitalController', hospitalController);

    hospitalController.$inject = ['$scope', '$rootScope', '$filter',
        '$state', '$stateParams', 'contentAuthorizationService',
        'memberDataService', '$translate'];

    function hospitalController($scope, $rootScope, $filter,
        $state, $stateParams, contentAuthorizationService,
            memberDataService, $translate) {

        console.log('@@hospitalController');

        $scope.serverPrefix = "https://www.iehp.org/Secure_Site"; //Normal
        $scope.serverPrefix = "https://internettest08.iehp.org/SecureSite_test";  // For Internal Access 

        $scope.IFRAME_PAGE_URL_HOSPITAL_NIA = $scope.serverPrefix + "/Auths/forms/NIARadiologyAuth.asp";

    }
})();