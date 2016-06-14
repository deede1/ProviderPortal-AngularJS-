(function() {
	'use strict';

	angular
		.module('MemberPortal')
		.controller('P4PController', P4PController);

	P4PController.$inject = ['$scope', '$rootScope', '$filter',
        '$state', '$stateParams', 'contentAuthorizationService',
        'memberDataService', '$translate' ];

	function P4PController($scope, $rootScope, $filter,
        $state,$stateParams, contentAuthorizationService,
            memberDataService, $translate) {

	    console.log('@@p4pCONTROLLER');

	    $scope.serverPrefix = "https://www.iehp.org/Secure_Site"; //Normal
	    $scope.serverPrefix = "https://internettest08.iehp.org/SecureSite_test";  // For Internal Access 

	    $scope.IFRAME_PAGE_URL_P4P_ENTRY_ASTHMAPROGRAM = $scope.serverPrefix + "/P4P/Asthma/Forms/MbrInfo.asp";
	    $scope.IFRAME_PAGE_URL_P4P_ENTRY_DIABETES = $scope.serverPrefix + "/P4P/Diabetes/forms/MbrInfo.asp";
	    $scope.IFRAME_PAGE_URL_P4P_ENTRY_DUALCHOICEANNUALVISIT = $scope.serverPrefix + "/P4P/DualChoice2/Forms/MbrInfo.asp";
	    $scope.IFRAME_PAGE_URL_P4P_ENTRY_PAPSCREEN = $scope.serverPrefix + "/P4P/Claims/forms/MbrInfo.asp";
	    $scope.IFRAME_PAGE_URL_P4P_ENTRY_PERINATALPOSTPARTUM = $scope.serverPrefix + "/P4P/Peri_Post/forms/MbrInfo.asp";
	    $scope.IFRAME_PAGE_URL_P4P_ENTRY_PM160 = $scope.serverPrefix + "/P4P/PM160/Forms/MbrInfo.asp";
	    $scope.IFRAME_PAGE_URL_P4P_ENTRY_YELLOWCARD = $scope.serverPrefix + "/P4P/YellowCard/forms/MbrInfo.asp";
	    $scope.IFRAME_PAGE_URL_P4P_STATUS_ASTHMAPROGRAM = $scope.serverPrefix + "/P4P/Asthma/Forms/AStatus.asp";
	    $scope.IFRAME_PAGE_URL_P4P_STATUS_DIABETES = $scope.serverPrefix + "/P4P/Diabetes/forms/DStatus.asp";
	    $scope.IFRAME_PAGE_URL_P4P_STATUS_DUALCHOICE = $scope.serverPrefix + "/P4P/DualChoice/Scripts/DualStatus.asp";
	    $scope.IFRAME_PAGE_URL_P4P_STATUS_PAPSCREEN = $scope.serverPrefix + "/P4P/Claims/forms/ClmStatus.asp";
	    $scope.IFRAME_PAGE_URL_P4P_STATUS_PERINATALPOSTPARTUM = $scope.serverPrefix + "/P4P/Peri_Post/forms/peripoststatus.asp";
	    $scope.IFRAME_PAGE_URL_P4P_STATUS_PM160 = $scope.serverPrefix + "/P4P/Index_P4P.htm";
	    $scope.IFRAME_PAGE_URL_P4P_STATUS_YELLOWCARD = $scope.serverPrefix + "/P4P/YellowCard/SCRIPTS/STATUS.asp";

	}
})();