(function() {
	'use strict';

	angular
		.module('MemberPortal')
		.controller('RosterPartialViewController', RosterPartialViewController);

	RosterPartialViewController.$inject = [
        '$scope', '$rootScope', '$location', '$filter', '$state', '$stateParams','contentAuthorizationService',
        'memberDataService', '$translate', '$uibModal'];

	function RosterPartialViewController($scope, $rootScope, $location, $filter, $state, $stateParams,contentAuthorizationService,
            memberDataService, $translate, $uibModal) { 
	        $scope.rosterTypeCode = $state.$current.resolve.params[0]().CGC;
	            console.log('@@@CONTROLLER =============  ROSTERS PARTIALVIEW >' + $scope.rosterTypeCode);
         
	            $scope.loading = false;
	            $scope.errorMessage = "";
	            $scope.infoMessage = "";
	            $scope.successMessage = "";
	            $scope.data = {};
	            $scope.TestUserMode = $rootScope.TestUserMode;
	            $scope.detailsCache = [];
	            $scope.predicate = null;
	            $scope.memberID = "";
	            $scope.savePDF = false;
	            $scope.WSEDO = "Rosters";
	            $scope.currentRow = { };
	            $scope.resultTier1 = {}; 

	            $scope.currentRow.resultTier2 = {};
	            $scope.currentRow.resultTier3 = {};
	            $scope.currentRow.resultTier4 = {};
	            $scope.currentRow.resultTier5 = {};
	            $scope.resultTier1.sortDirection = 0;
 
	            $scope.currentRow.resultTier2.sortDirection = 0;
	            $scope.currentRow.resultTier3.sortDirection = 0;
	            $scope.currentRow.resultTier4.sortDirection = 0;
	            $scope.currentRow.resultTier5.sortDirection = 0;

	            $scope._providerTaxID = $rootScope.ProviderTaxID;
	            $scope.csvBubbleTitle = "";
	            $scope.tier1ResultsQty = 0; 

	            //===========================PAGINATION
	            $scope.rowsPerPage = 25;
	            $scope.totalPages = 0; 
	            $scope.startItem = function (currentPage, rowsPerPage) {
	                if (currentPage) {
	                    return (currentPage - 1) *  rowsPerPage + 1;
	                } else {
	                    return (1 - 1) * rowsPerPage + 1;
	                }
	            }; 
	      
	            $scope.endItem = function (currentPage, totalListCount, rowsPerPage) {
	                var lastPotItem;
	                if (currentPage) {
	                    lastPotItem = currentPage * rowsPerPage;
	                    if (lastPotItem > totalListCount)
	                        lastPotItem = totalListCount;
	                } else {
	                    lastPotItem = 1 * rowsPerPage;
	                    if (lastPotItem > totalListCount)
	                        lastPotItem = totalListCount;
	                }
	                return lastPotItem;
	            }; 

	            $scope.pageChanged = function(viewLevel, rosterType, criteriaObject, currentPage, totListCount, rosterRow) {
	            console.log('PAGE CHANGED AT LEVEL:' + viewLevel + ' PAGE:' + currentPage + ' ROSTER:' + rosterType);
	            $scope.requestParameters = {}; //Init 
	            $scope.currentRow = rosterRow; 

	                //var reqO = memberDataService.WebServiceEndpointDefinitionObject[$scope.WSEDO];
	        var reqO = memberDataService.getWebServiceObject($scope.WSEDO);
	        var rosterObject = memberDataService.GetObjectsFromJSON(reqO, 'RosterTypeCode', rosterType); // (object, Key, Value)  
	        var reqParams = memberDataService.GetObjectsFromJSON(rosterObject, 'ViewLevel', viewLevel)[0].RequiredParams; 

	            $scope.requestParameters = memberDataService.GetObjectsFromJSON(rosterObject, 'ViewLevel', viewLevel)[0].Params; 

	        var rowsPerPage = memberDataService.GetObjectsFromJSON(rosterObject, 'ViewLevel', viewLevel)[0].Params.RowsPerPage;

	        //Check for required parameter defined in WSEDO 
	        if (reqParams.hasOwnProperty('ProviderTaxID')) {
	            $scope.requestParameters.ProviderTaxId = $rootScope.ProviderTaxID;
	            console.log('@PROVTAXID IS REQUIRED!  =' + $rootScope.ProviderTaxID);
	             }

	            $scope.requestParameters.PageNumber = currentPage;
                $scope.requestParameters.RowsPerPage = rowsPerPage; 
 
	             switch (viewLevel) {
	                 case 1: 
	                     $scope.resultTier1.currentPage = currentPage;
	                     $scope.resultTier1.rowsPerPage = rowsPerPage; 
	                     break;
	                 case 2:
	                     $scope.currentRow.currentPage = currentPage;
	                     $scope.currentRow.rowsPerPage = rowsPerPage; 
                          
	                     break;
	                 case 3:
	                     $scope.currentRow.currentPage = currentPage;
	                     $scope.currentRow.rowsPerPage = rowsPerPage;
	                     break; 

                    }

	                console.log('==================================request params');
	                console.dir($scope.requestParameters);



	                memberDataService.GetRosterSubViewDetails($scope.WSEDO, $scope.rosterTypeCode, viewLevel, JSON.stringify($scope.requestParameters)).success(function (data) {
	                    $scope.loading = false; 
	                    switch (viewLevel) {
	                        case 1:  
	                            $scope.resultTier1.data = data;
	                            $scope.resultTier1.totalListCount = data.ListMetaData.TotalListCount;
	                            $scope.resultTier1.totalPages = data.ListMetaData.TotalPageCount;
	                            $scope.resultTier1.currentPage = currentPage;
	                            $scope.resultTier1.rowsPerPage = rowsPerPage; 
	                            break;
	                        case 2:
	                            $scope.currentRow.data = data;
	                            $scope.currentRow.totalListCount = data.ListMetaData.TotalListCount;
	                            $scope.currentRow.totalPages = data.ListMetaData.TotalPageCount;
	                            $scope.currentRow.currentPage = currentPage;
	                            $scope.currentRow.rowsPerPage = rowsPerPage;
	                            break;
	                        case 3:
	                            $scope.currentRow.data = data;
	                            $scope.currentRow.totalListCount = data.ListMetaData.TotalListCount;
	                            $scope.currentRow.totalPages = data.ListMetaData.TotalPageCount;
	                            $scope.currentRow.currentPage = currentPage;
	                            $scope.currentRow.rowsPerPage = rowsPerPage;
 
	                            break;

	                    }

	                }).error(function () {
	                    //console.log('@sorting RosterHM_HMCMRController ERROR GETTING DETAILS! ');
	                    $scope.loading = false;
	                    $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
	                });
	            };
	      

	            //====== HEADER GROUPING ICONS 
	            $scope.displayFullView = true; //Default
	            $scope.displayGroupedView = false;
 

	                $scope.titleHeaderParam = {
	                    title: '',
	                    displayImportExport: true,
	                    displayViewOptionFull: false,
	                    displayViewOptionGrouped: false
	                };
	    
         

	            $scope.subscriberNumber = ""; 

	            $scope.rosterSubViewLevel1 = {};
	            $scope.rosterSubViewLevel2 = {}; 
	            $scope.rosterSubViewLevel3 = {};
	            $scope.rosterSubViewLevel4 = {};
	            $scope.rosterSubViewLevel5 = {};

 


	            //===== FETCH ROSTER 
	            $scope.RetrieveRoster = function (rosterTypeCode, pageIndex, requestParameters, rosterRow) {
	                console.log('>> @RETRIEVEROSTER  ROSTERTYPECODE:' + rosterTypeCode + ' pageIndex:' + pageIndex + ' rosterRow:' + rosterRow );
 	                $scope.loading = true;
 	                $scope.requestParameters = {};
                     
	                console.dir(requestParameters.Sort);
 
	                //------ Get Roster Title 
	                // var reqO = memberDataService.WebServiceEndpointDefinitionObject[$scope.WSEDO];
	                var reqO = memberDataService.getWebServiceObject($scope.WSEDO);
	                var rosterObject = memberDataService.GetObjectsFromJSON(reqO, 'RosterTypeCode', rosterTypeCode); // (object, Key, Value)  
                    $scope.rosterTypeCode = rosterTypeCode;
 
	                //=================================== FETCH DATA 
	                $scope.expandViewDetails(rosterTypeCode, 1,  requestParameters, rosterRow, null, null, 1, 0);
	            }


            
       $scope.viewMemberDemographics = function() {
           alert('Coming Soon');
       }


 

	    $scope.expandViewDetails = function(rosterType, viewLevel, criteriaObject, roster, rosterRow, tierView, isHorizontalView) {
           console.log('============@EXPAND VIEW DET OF LEVEL:' + viewLevel + '   tierView:' + tierView); // ischildView

           if (!isHorizontalView) {
               console.log('IS NOT HORIZONTAL VIEW');
               _.forEach(roster, function (result) {
                   // if (isChildView !== undefined)
                   //  if (!isChildView  )
                   if (result === rosterRow) {
                       console.log('CO>> RESULT=ROSTER_ROW CURRENT IS EXPANDED?:' + result.expand + ' ---- NEXT; EXPAND:' + !result.expand);
                       result.expand = !result.expand;
                   } else {
                       console.log('CO>>  CLOSE/COLLAPSE');
                       result.expand = false;
                   }
               });
           } else {
               console.log('IS HORIZ VIEW');
           }

                    $scope.currentRow = rosterRow; //used for expanding upon data retrieval  
           //Do we have expanded items in cache? if so open and return;
           console.log('@== rosterRow =' + rosterRow);
                    if (rosterRow != undefined) {

                      
                        console.log(' rosterRow.rosterSubViewLevel2 =' + rosterRow.rosterSubViewLevel2);
                        console.log(' rosterRow.rosterSubViewLevel3 =' + rosterRow.rosterSubViewLevel3);
                        console.log(' rosterRow.rosterSubViewLevel4 =' + rosterRow.rosterSubViewLevel4);
                        console.log(' rosterRow.rosterSubViewLevel5 =' + rosterRow.rosterSubViewLevel5);
                        console.log('@@ rosterRow.expand = ' + rosterRow.expand); 

                        if (rosterRow.expand == true || rosterRow.expand == undefined) {

	                        console.log('EXPAND IT');

	                       // if (!isChildView) {
	                        //if (tierView === 1 && rosterRow.data != undefined || (viewLevel === 3)) {
	                        //        console.log('A ');
	                        //        rosterRow.expand = true;
	                        //        if (rosterRow.data != undefined) {
	                        //            return;
	                        //        }
	                        //    }
	                            if (tierView == 2 && rosterRow.rosterSubViewLevel2 != undefined) {
	                                console.log('B ');
	                                rosterRow.rosterSubViewLevel2 = true;
	                                rosterRow.expand = true;
	                                return;
	                            }
	                            if (tierView == 3 && rosterRow.rosterSubViewLevel3 != undefined) {
	                                console.log('C ');
	                                rosterRow.rosterSubViewLevel3 = true;
	                                rosterRow.expand = true;
	                                return;
	                            }
	                            if (tierView == 4 && rosterRow.rosterSubViewLevel4 != undefined) {
	                                console.log('D ');
	                                rosterRow.rosterSubViewLevel4 = true;
	                                rosterRow.expand = true;
	                                return;
	                            }
	                            if (tierView == 5 && rosterRow.rosterSubViewLevel5 != undefined) {
	                                console.log('E');
	                                rosterRow.rosterSubViewLevel5 = true;
	                                rosterRow.expand = true;
	                                return;
	                            }
	                       // }

	                    } else { //Cache items 
	                      //  if (tierView == 1) {
	                            console.log('..ALREADY EXPANDED; RETURN');
	                            //Already open, close
	                            $('.expanded-header').removeClass('expanded-header');
	                            rosterRow.expand = false;
	                            return;
	                     //   }
	                    }
	                }
             
                    console.log('CALL FETCH VIEW DETAILS criteria...');
	        console.dir(criteriaObject);
	                $scope.fetchViewDetails(rosterType, viewLevel, criteriaObject, rosterRow);
	            }

       //===== FETCH SUB DETAILS 
	   $scope.fetchViewDetails = function(rosterType, viewLevel, criteriaObject, rosterRow) {
	        console.log('====@EXPAND VIEW DETAILS ROSTER:' + rosterType + ' LEVEL:' + viewLevel);

	        if ($scope.rosterRow == undefined && rosterRow != undefined) {
	            $scope.currentRow = rosterRow; 
	        }
 

	        if (criteriaObject.Sort != undefined) {
	            $scope.$broadcast('updateTableHeader', { sortColumn: criteriaObject.Sort[0].name, sortDirection: criteriaObject.Sort[0].direction });
	        }

	        if (criteriaObject.Sort != undefined) { 
	            $scope.ColumnName = criteriaObject.Sort[0].name;
	        }

	        console.log('NOT OPEN... FETCH DATA');

	        $scope.dataResultMessageTier1 = null;
	        $scope.dataResultMessageTier2 = null;
	        $scope.dataResultMessageTier3 = null;
	        $scope.dataResultMessageTier4 = null;
	        $scope.dataResultMessageTier5 = null;


	        console.log('@EXPANDROSTERDETAILS > roster:' + rosterType + ':  viewLevel:' + viewLevel);

	        //=================== BASE REQUEST PARAMETERS FOR SPECIFIC API ENDPOINT
	        $scope.requestParameters = {};  

	       // var reqO = memberDataService.WebServiceEndpointDefinitionObject[$scope.WSEDO];
	        var reqO = memberDataService.getWebServiceObject($scope.WSEDO);
	        var rosterObject = memberDataService.GetObjectsFromJSON(reqO, 'RosterTypeCode', rosterType); // (object, Key, Value)  
	        var reqParams = memberDataService.GetObjectsFromJSON(rosterObject, 'ViewLevel', viewLevel)[0].RequiredParams;
	        $scope.requestParameters = memberDataService.GetObjectsFromJSON(rosterObject, 'ViewLevel', viewLevel)[0].Params;
	        var rowsPerPage = memberDataService.GetObjectsFromJSON(rosterObject, 'ViewLevel', viewLevel)[0].Params.RowsPerPage;

	  
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
	      
	     
                    

                    //============ Override request paramters with custom criteria 
	                jQuery.each(criteriaObject, function (i, val) { 
	                    $scope.requestParameters[i] = val;
	                    if ($scope.requestParameters.length > 0) {
	                        jQuery.each($scope.requestParameters[i], function(j, val2) { 
	                            $scope.requestParameters[i][j] = val[0];
	                        });
	                    }
	                });

 
                    $scope.currentViewLevel = viewLevel; 
                    $scope.loading = true;

	                memberDataService.GetRosterSubViewDetails($scope.WSEDO, $scope.rosterTypeCode, viewLevel, JSON.stringify($scope.requestParameters), $rootScope.ProviderType).success(function (data) {
	                    $scope.loading = false;

	                    console.log('@GETROSTERSUB VIEWDETAIL level:' + $scope.currentViewLevel);
	                    switch ($scope.currentViewLevel) {
	                        case 1: 
	                                $scope.data = data;
	                                $scope.totalPages = data.ListMetaData.TotalPageCount;
	                                $scope.totalListCount = data.ListMetaData.TotalListCount;
	                                $scope.rowsPerPage = rowsPerPage;
	                                $scope.currentPage = 1;
	                                if (data.ListMetaData.TotalPerPage > data.ListMetaData.TotalListCount) {
	                                    $scope.tier1ResultsQty = data.ListMetaData.TotalListCount;
	                                } else {
	                                    if (data.ListMetaData.TotalPageCount > $scope.requestParameters.PageNumber) {

	                                        $scope.tier1ResultsQty = rowsPerPage;
	                                    }  
	                                }
	                               

	                                if ($scope.sortDirection == undefined) {
	                                    $scope.sortDirection = 1;  
	                                }
	                                else { 
	                                    $scope.sortDirection = !$scope.sortDirection;
	                                } 
	                       
	                                $scope.sortColumn = $scope.ColumnName;   
	                                if (data.ListMetaData.TotalListCount == 0) { 
	                                    $scope.dataResultMessageTier1 = "No Data Available";
	                                }
	                                break;
	                        case 2: 
	                                if ($scope.currentRow.sortDirection == undefined) {
	                                    console.log('@ SORT DIR IS UNDEFINED');
	                                    $scope.currentRow.sortDirection = 1;
	                                }
	                                else {
	                                    $scope.currentRow.sortDirection = !$scope.currentRow.sortDirection;
	                                }

	                                $scope.currentRow.data = data;
	                                $scope.currentRow.totalPages = data.ListMetaData.TotalPageCount;
	                                $scope.currentRow.totalListCount = data.ListMetaData.TotalListCount;
	                                $scope.currentRow.rowsPerPage = rowsPerPage;
	                                $scope.currentRow.tier2RowsDisplayedQty = rowsPerPage;
	                                $scope.currentRow.tier2RowsTotal = data.ListMetaData.TotalListCount;

                                    if ($scope.currentRow.currentPage == undefined)
                                        $scope.currentRow.currentPage = 1;

                                    if (data.ListMetaData.TotalPerPage > data.ListMetaData.TotalListCount) {
                                        $scope.tier2RowsDisplayedQty = data.ListMetaData.TotalListCount;
                                    } else {

                                        if (data.ListMetaData.TotalPageCount > $scope.requestParameters.PageNumber) {

                                            $scope.tier2RowsDisplayedQty = rowsPerPage;
                                        }
                                    }



                                    if (data.ListMetaData.TotalListCount === 0 || data.List.length === 0) {
                                        console.log('@TIER 2: NODATA');
	                                    $scope.currentRow.dataResultMessageTier2 = "No Data Available for "+ $scope.currentRow.ProviderFName + ' ' + $scope.currentRow.ProviderLName;
	                                }
	                                break;
	                        case 3:
	                                $scope.currentRow.totalPages = data.ListMetaData.TotalPageCount;
	                                $scope.currentRow.totalListCount = data.ListMetaData.TotalListCount;
	                                $scope.currentRow.rowsPerPage = rowsPerPage; 
	                                $scope.currentRow.data = data; 
	                                $scope.currentRow.tier3RowsDisplayedQty = rowsPerPage;
	                                $scope.currentRow.tier3RowsTotal = data.ListMetaData.TotalListCount;

                                    if ($scope.currentRow.sortDirection === undefined) {
	                                        $scope.currentRow.sortDirection = 1;
	                                        }
                                    else {
	                                        $scope.currentRow.sortDirection = !$scope.currentRow.sortDirection; 
	                                        }
	                                if (data.ListMetaData.TotalListCount != undefined) {
	                                    if (data.ListMetaData.TotalListCount === 0) {
	                                        console.log('@TIER 3: NODATA');
	                                                    $scope.currentRow.dataResultMessageTier3 = "No Data Available for " + $scope.currentRow.MemberFName + ' ' + $scope.currentRow.MemberLName;
	                                                }
	                                            }  
	                            break;
	                        case 4:
                                    $scope.currentRow.data = data;
                                    if ($scope.currentRow.sortDirection === undefined) {
	                                        $scope.currentRow.sortDirection = 1;
	                                    }
	                                    else {
	                                          $scope.currentRow.sortDirection = !$scope.currentRow.sortDirection; 
	                                    }
	                            if (data.ListMetaData.TotalListCount != undefined) {
	                                if (data.ListMetaData.TotalListCount === 0) {
	                                    console.log('@TIER 4: NODATA');
	                                    $scope.currentRow.dataResultMessageTier4 = "No Data Available";
	                                }
	                            }
	                            break;
	                        case 5:
	                            $scope.rosterSubViewLevel5.data = data;
                                    if ($scope.currentRow.sortDirection === undefined) {
	                                    $scope.currentRow.sortDirection = 1;
	                                    }
	                                    else {
	                                           $scope.currentRow.sortDirection = !$scope.currentRow.sortDirection; 
	                                    }

	                                if (data.ListMetaData.TotalListCount != undefined) {
	                                    if (data.ListMetaData.TotalListCount === 0) {
	                                        console.log('@TIER 5: NODATA');
	                                        $scope.currentRow.dataResultMessageTier5 = "No Data Available";
	                                        
	                                    }
	                                }
	                            break;
	                            } 

	                        if ($scope.currentRow != undefined) {
	                            $scope.currentRow.expand = true; 
	                        }



	                }).error(function () {
	                    console.log('@GetRosterSubViewDetails ERROR GETTING DETAILS! Level: ' + $scope.currentViewLevel);
	                    var errorMsg = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
	                    $scope.loading = false;
	                    switch ($scope.currentViewLevel) {
	                        case 1: $scope.dataResultMessageTier1 = errorMsg;
	                        case 2: if ($scope.currentRow) $scope.currentRow.dataResultMessageTier2 = errorMsg;
	                        case 3: if ($scope.currentRow) $scope.currentRow.dataResultMessageTier3 = errorMsg;
	                        case 4: if ($scope.currentRow) $scope.currentRow.dataResultMessageTier4 = errorMsg;
	                        case 5: if ($scope.currentRow) $scope.currentRow.dataResultMessageTier5 = errorMsg;
	                    default:
	                    }
	                 });

	            }
            
                //UIContentAuthorization
                $scope.siteItem = []; 
                $scope.siteItem = contentAuthorizationService.processContentAuth($scope.rosterTypeCode);
                $scope.RetrieveRoster($scope.rosterTypeCode, 1, "");
	}
})();