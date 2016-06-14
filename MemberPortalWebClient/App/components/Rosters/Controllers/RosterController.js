(function() {
	'use strict';

	angular
		.module('MemberPortal')
		.controller('RosterController', RosterController);

	RosterController.$inject = ['$scope', '$rootScope', '$filter',
        '$state', '$stateParams', 'contentAuthorizationService',
        'memberDataService', '$translate' ];

	function RosterController($scope, $rootScope, $filter,
        $state,$stateParams, contentAuthorizationService,
            memberDataService, $translate) {

	    console.log('@@ROSTER-CONTROLLER');

	    //iFrame Early Start Roster
	    $scope.serverPrefix = "https://www.iehp.org/Secure_Site"; //Normal
	    $scope.serverPrefix = "https://internettest08.iehp.org/SecureSite_test";  // For Internal Access 

	    $scope.IFRAME_PAGE_URL_ROSTER_EARLYSTART = $scope.serverPrefix + "/eligibility/Forms/EarlyStart.asp";
	    $scope.IFRAME_PAGE_URL_ROSTER_ECOUNTERDATA = $scope.serverPrefix + "/reports/Encounter/scripts/EncReport.asp";
	    $scope.IFRAME_PAGE_URL_ROSTER_CCMREFERRALS = $scope.serverPrefix + "/Eligibility/Forms/CCMPlanReferral.asp";
	    $scope.IFRAME_PAGE_URL_ROSTER_CCMTRANSFER = $scope.serverPrefix + "/reports/CCMTransfers/Forms/CCMTransferSummary.asp";
	    $scope.IFRAME_PAGE_URL_ROSTER_MCRTRANSFER = $scope.serverPrefix + "/reports/MCRTransfers/Scripts/MCRTransfersSummary.asp";
	    $scope.IFRAME_PAGE_URL_ROSTER_HCCROSTER = $scope.serverPrefix + "/reports/MCRTransfers/Scripts/HCCSummary.asp";
	}

})();