(function() {
	'use strict';

	angular
		.module('MemberPortal')
		.controller('RosterHM_HMCMRController', RosterHM_HMCMRController);

	RosterHM_HMCMRController.$inject = ['$scope', '$rootScope', '$filter',
        '$state', '$stateParams', 'contentAuthorizationService',
        'memberDataService' ];

	function RosterHM_HMCMRController($scope, $rootScope, $filter, $state,$stateParams, contentAuthorizationService, memberDataService) {

	   // $scope.rosterTypeCode = $state.$current.ownParams.CGC.value();
	    $scope.rosterTypeCode = $state.$current.resolve.params[0]().CGC;

	    $scope.isPartialView = $state.$current.resolve.params[0]().isPartial !== undefined ? true: false;
	    $scope.resetMemberPage = false;

	    $scope.loading = false;
	    $scope.errorMessage = "";
	    $scope.data = {};
	    $scope.WSEDO = "Rosters";
	    $scope.siteItem = [];
	    $scope.siteItem = contentAuthorizationService.processContentAuth($state.$current.resolve.params[0]().CGC);//$state.$current.ownParams.CGC.value());
	    $scope.loading = false;
	    $scope.errorMessage = "";
	    ////====== HEADER GROUPING ICONS 
	    //$scope.displayFullView = true; //Default
	    //$scope.displayGroupedView = false;

	    //====== DEFAULT TITLE/ HEADER
	 
	        $scope.titleHeaderParam = {
	            title: '',
	            displayImportExport: false,
	            displayViewOptionFull: false,
	            displayViewOptionGrouped: false
	        }
	    //=============sorting
	    $scope.sortCol = 'ProviderLName';
	    $scope.sortDirection = 'ascending';
	    $scope.order = function (colName, viewLevel, rosterType, criteriaObject, rosterRow) {

	        $scope.loading = true;
	        $scope.currentRow = rosterRow;
	        if (colName === $scope.sortCol)
	            $scope.sortDirection = $scope.sortDirection === 'ascending' ? 'descending' : 'ascending';
	        else {
	            $scope.sortCol = colName;
	            $scope.sortDirection = 'ascending';
	        }

	        $scope.requestParameters = {}; //Init

	        //var reqO = memberDataService.WebServiceEndpointDefinitionObject[$scope.WSEDO];
	        var reqO = memberDataService.getWebServiceObject($scope.WSEDO);
	        var rosterObject = memberDataService.GetObjectsFromJSON(reqO, 'RosterTypeCode', rosterType); // (object, Key, Value)  
	        var reqParams = memberDataService.GetObjectsFromJSON(rosterObject, 'ViewLevel', viewLevel)[0].RequiredParams;
	        $scope.requestParameters = memberDataService.GetObjectsFromJSON(rosterObject, 'ViewLevel', viewLevel)[0].Params;

	        // API request is based on WSEDO object definition; wether IPA or PCP
	        if ($rootScope.ProviderType == 'IPA') {
	            console.log('PROVTYPE IPA; CHECK IF IPA IS REQUIRED');
	            if (reqParams.hasOwnProperty('Ipa')) {
	                console.log('IPA IS REQUIRED! >' + $rootScope.ProviderNumber.substring($rootScope.ProviderNumber.length - 3));
	                $scope.requestParameters.Ipa = $rootScope.ProviderNumber.substring($rootScope.ProviderNumber.length - 3);
	            }
	        }
	        if ($rootScope.ProviderType == 'PCP') {
	            console.log('PROVTYPE PCP; CHECK IF PROV TAX ID IS REQUIRED');
	            if (reqParams.hasOwnProperty('ProviderTaxId')) {
	                console.log('PROV TAX ID ISREQUIRED! >' + $rootScope.ProviderTaxID);
	                $scope.requestParameters.ProviderTaxId = $rootScope.ProviderTaxID;
	            }
	        }
	        $scope.requestParameters.Sort[0].name = $scope.sortCol;
	        $scope.requestParameters.Sort[0].direction = $scope.sortDirection;
	      
	        //Add or Update New criteria not available in base Object
	        jQuery.each(criteriaObject, function (i, val) {
	            $scope.requestParameters[i] = val;
	        });

	        memberDataService.GetRosterSubViewDetails($scope.WSEDO, rosterType, viewLevel, JSON.stringify($scope.requestParameters),$rootScope.ProviderType).success(function (data) {
	            $scope.loading = false;
	            if(viewLevel===1) {
	               
	                    $scope.data = data;
	                    if (data.ListMetaData.TotalListCount === 0) {
	                        $scope.dataResultMessageTier1 = "No Data Available";
	                    }
	            }

	        }).error(function () {
	           // console.log('@sorting RosterHM_HMCMRController ERROR GETTING DETAILS! ');
	            $scope.loading = false;
	            $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
	        });


	    };

	    //===========================PAGINATION
	    $scope.rowsPerPage = 100;
	    $scope.totalPages = 0;
	   $scope.startItem = function (currentPage) {
	       if (currentPage) {
	           return (currentPage - 1) * $scope.rowsPerPage   + 1;
	       } else {
	           return (1 - 1) * $scope.rowsPerPage + 1;
	       }
	   };
	   $scope.endItem = function (currentPage) {
	       var lastPotItem;
           if (currentPage) {
               lastPotItem = currentPage * $scope.rowsPerPage;
               if (lastPotItem > $scope.data.ListMetaData.TotalListCount)
                   lastPotItem = $scope.data.ListMetaData.TotalListCount;
           } else {
               lastPotItem = 1 * $scope.rowsPerPage;
               if (lastPotItem > $scope.data.ListMetaData.TotalListCount)
                   lastPotItem = $scope.data.ListMetaData.TotalListCount;
           }
	     
	        return lastPotItem;
	    };
	    $scope.pageChanged = function (viewLevel, rosterType, criteriaObject,currentPage) {

	        $scope.requestParameters = {}; //Init

	        //var reqO = memberDataService.WebServiceEndpointDefinitionObject[$scope.WSEDO];
	        var reqO = memberDataService.getWebServiceObject($scope.WSEDO);
	        var rosterObject = memberDataService.GetObjectsFromJSON(reqO, 'RosterTypeCode', rosterType); // (object, Key, Value)  
	        var reqParams = memberDataService.GetObjectsFromJSON(rosterObject, 'ViewLevel', viewLevel)[0].RequiredParams;
	        $scope.requestParameters = memberDataService.GetObjectsFromJSON(rosterObject, 'ViewLevel', viewLevel)[0].Params;

	        // API request is based on WSEDO object definition; wether IPA or PCP
	        if ($rootScope.ProviderType == 'IPA') {
	            console.log('PROVTYPE IPA; CHECK IF IPA IS REQUIRED');
	            if (reqParams.hasOwnProperty('Ipa')) {
	                console.log('IPA IS REQUIRED! >' + $rootScope.ProviderNumber.substring($rootScope.ProviderNumber.length - 3));
	                $scope.requestParameters.Ipa = $rootScope.ProviderNumber.substring($rootScope.ProviderNumber.length - 3);
	            }
	        }
	        if ($rootScope.ProviderType == 'PCP') {
	            console.log('PROVTYPE PCP; CHECK IF PROV TAX ID IS REQUIRED');
	            if (reqParams.hasOwnProperty('ProviderTaxId')) {
	                console.log('PROV TAX ID ISREQUIRED! >' + $rootScope.ProviderTaxID);
	                $scope.requestParameters.ProviderTaxId = $rootScope.ProviderTaxID;
	            }
	        }
	        switch (viewLevel) {
	            case 1:
	                $scope.requestParameters.PageNumber =currentPage;
	                $scope.requestParameters.RowsPerPage = $scope.rowsPerPage;
	                $scope.startItem(currentPage);
	                $scope.endItem(currentPage);
	                break;
	           
	        }

	    

	        memberDataService.GetRosterSubViewDetails($scope.WSEDO, rosterType, viewLevel, JSON.stringify($scope.requestParameters),$rootScope.ProviderType).success(function (data) {
	            $scope.loading = false;
	            switch (viewLevel) {
	                case 1:
	                    $scope.data = data;
	                    $scope.totalPages = data.ListMetaData.TotalPageCount;
	                    break;
	            }

	        }).error(function () {
	            //console.log('@sorting RosterHM_HMCMRController ERROR GETTING DETAILS! ');
	            $scope.loading = false;
	            $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
	        });
	    };

	 
	
	    //===== FETCH ROSTER
	     function RetrieveRoster(rosterTypeCode, pageIndex) {
	     //   console.log('@RETRIEVE ROSTER ... fetching ROSTER:' + rosterTypeCode + ' PAGEINDEX:' + pageIndex);
	        $scope.loading = true;
	        $scope.requestParameters = {};

	         //------ Get Roster Title
	        var reqO = memberDataService.getWebServiceObject($scope.WSEDO);
	        //var reqO = webserviceObject;
	        var rosterObject = memberDataService.GetObjectsFromJSON(reqO, 'RosterTypeCode', rosterTypeCode); // (object, Key, Value)  
	        $scope.titleHeaderParam.title = rosterObject[0].RosterTitle;
	        $scope.rosterTypeCode = rosterTypeCode;
	        //=================================== FETCH DATA
	        $scope.expandViewDetails(rosterTypeCode, 1, $scope.requestParameters);
	    }
	    //===== FETCH SUB DETAILS 
	    $scope.expandViewDetails = function (rosterType, viewLevel, criteriaObject, rosterRow) {
	        $scope.loading = true;
	        $scope.errorMessage = "";
	        if (rosterRow != undefined) {
	            _.forEach($scope.data.List, function(result) {
	                if (result === rosterRow) {
	                    //console.log('CO>> RESULT=ROSTER_ROW CURRENT IS EXPANDED?:' + result.showDetails + ' ---- NEXT; EXPAND:' + !result.showDetails);
	                    result.showDetails = !result.showDetails;
	                } else { //close all
	                   // console.log('CO>>  CLOSE/COLLAPSE');
	                    result.showDetails = false;
	                }
	            });
	        }


	        if (rosterRow != undefined) {
	            if (!rosterRow.showDetails) {
	                $scope.resetMemberPage = true;
	                $scope.loading = false;
	                return;
	            } 
	        }

	        //=================== BASE REQUEST PARAMETERS FOR SPECIFIC ENDPOINT
	        $scope.requestParameters = {}; //Init

	        //var reqO = memberDataService.WebServiceEndpointDefinitionObject[$scope.WSEDO];
	        var reqO = memberDataService.getWebServiceObject($scope.WSEDO);
	        var rosterObject = memberDataService.GetObjectsFromJSON(reqO, 'RosterTypeCode', rosterType); // (object, Key, Value)  
	        var reqParams = memberDataService.GetObjectsFromJSON(rosterObject, 'ViewLevel', viewLevel)[0].RequiredParams;
	        $scope.requestParameters = memberDataService.GetObjectsFromJSON(rosterObject, 'ViewLevel', viewLevel)[0].Params;

	        // API request is based on WSEDO object definition; wether IPA or PCP
	        if ($rootScope.ProviderType == 'IPA') {
	            console.log('PROVTYPE IPA; CHECK IF IPA IS REQUIRED');
	            if (reqParams.hasOwnProperty('Ipa')) {
	                console.log('IPA IS REQUIRED! >' + $rootScope.ProviderNumber.substring($rootScope.ProviderNumber.length - 3));
	                $scope.requestParameters.Ipa = $rootScope.ProviderNumber.substring($rootScope.ProviderNumber.length - 3);
	            }
	        }
	        if ($rootScope.ProviderType == 'PCP') {
	            console.log('PROVTYPE PCP; CHECK IF PROV TAX ID IS REQUIRED');
	            if (reqParams.hasOwnProperty('ProviderTaxId')) {
	                console.log('PROV TAX ID ISREQUIRED! >' + $rootScope.ProviderTaxID);
	                $scope.requestParameters.ProviderTaxId = $rootScope.ProviderTaxID;
	            }
	        }

	        jQuery.each(criteriaObject, function (i, val) {
	            $scope.requestParameters[i] = val;
	            if ($scope.requestParameters.length > 0) {
	                jQuery.each($scope.requestParameters[i], function (j, val2) {
	                    $scope.requestParameters[i][j] = val[0];
	                });
	            }
	        });
	        console.dir(criteriaObject[20]);

	        //reset page number and sort direction
	        $scope.requestParameters.PageNumber = 1;
	        if (viewLevel === 1) {
	            $scope.requestParameters.Sort[0].name = "ProviderLName";
	        }
	        else if (viewLevel === 2) {
	            $scope.requestParameters.Sort[0].name = "MemberLName";
	        }
	        $scope.requestParameters.Sort[0].direction = 'ascending';
	       // console.log('request parma before  ' + JSON.stringify($scope.requestParameters));
	  
	        memberDataService.GetRosterSubViewDetails($scope.WSEDO, $scope.rosterTypeCode, viewLevel, JSON.stringify($scope.requestParameters),$rootScope.ProviderType).success(function (data) {
	            $scope.loading = false;

	            switch (viewLevel) {
	            case 1:
	                $scope.data = data;
                    if (data.List.length === 0) {
                        $scope.errorMessage = "No Data Available";
                    }
	                $scope.totalPages = data.ListMetaData.TotalPageCount;
	                _.each($scope.data.List, function(p) {
	                    if (p) {
	                        p.showDetails = false;
	                    }
	                });
	                break;
	                case 2:
	                    rosterRow.members = data;
	                    if (rosterRow.members) {
	                        _.each(rosterRow.members.List, function (m) {
	                            m.PlanCreateDate = moment(m.PlanCreateDate).format("MM/DD/YYYY");
	                            m.showDetails = false;
	                        });
	                    }
	                break;
	            }


	        }).error(function () {
	     
	            $scope.loading = false;
	            $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
	        });

	    }


	    //========================= CONTENT AUTHORIZATION DEFAULTS  
	    $scope.siteItem = [];
	    $scope.siteItem = contentAuthorizationService.processContentAuth($state.$current.resolve.params[0]().CGC);

	    //console.log('@@@CONTROLLER =============  RosterHM_HMCMRController >' + $scope.rosterTypeCode);
	    RetrieveRoster($scope.rosterTypeCode, 1);

	}
})();