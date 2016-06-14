(function() {
	'use strict';

	angular
		.module('MemberPortal')
		.controller('UrgentCareListController', UrgentCareListController);

	UrgentCareListController.$inject = [
        '$scope', '$rootScope', '$location', '$filter', '$state', '$stateParams','contentAuthorizationService',
        'memberDataService', '$translate'];

	function UrgentCareListController($scope, $rootScope, $location, $filter, $state, $stateParams, contentAuthorizationService,
            memberDataService, $translate) {
         

	          $scope.rosterTypeCode = $state.$current.resolve.params[0]().CGC;
              $scope.WSEDO = "Rosters";   
              $scope.siteItem = [];
              $scope.siteItem = contentAuthorizationService.processContentAuth($scope.rosterTypeCode);
          

              console.log('@@@CONTROLLER =============  URGENT CARELIST  >' + $scope.rosterTypeCode);
         
              $scope.loading = false;
              $scope.errorMessage = "";
              $scope.infoMessage = "";
              $scope.successMessage = "";
              $scope.data = {};
              $scope.TestUserMode = $rootScope.TestUserMode;
              $scope.detailsCache = [];
              $scope.predicate = null;
              $scope.memberID = ""; 

	          //====== HEADER GROUPING ICONS 
              $scope.displayFullView = true; //Default
              $scope.displayGroupedView = false;

	          //====== DEFAULT TITLE/ HEADER
              $scope.titleHeaderParam = {
                  title: '',
                  displayImportExport: true,
                  displayViewOptionFull: false,
                  displayViewOptionGrouped: false
              }; 

              $scope.rosterSubViewLevel2 = {}; //@@@@@@@@@@@@@@@@
              $scope.rosterSubViewLevel3 = {}; //@@@@@@@@@@@@@@@@  


	          //===== FETCH ROSTER 
              $scope.RetrieveRoster = function (rosterTypeCode, pageIndex, sortBy) {
                  console.log('@RETRIEVE ROSTER ... fetching ROSTER:' + rosterTypeCode + ' PAGEINDEX:' + pageIndex + ' SORTBY:' + sortBy);
                  $scope.loading = true;
                  //Override default params
                  $scope.requestParameters = {
                      Distance: 25, 
                      UseLatLongSearch: false,
                      Zipcode: '91730',
                      City: 'Rancho Cucamonga' 
                  };

                  //------ Get Roster Title
                  console.log('@@@ WSEDO=' + $scope.WSEDO);
                  //  var reqO = memberDataService.WebServiceEndpointDefinitionObject[$scope.WSEDO];
                  var reqO = memberDataService.getWebServiceObject($scope.WSEDO);
                  var rosterObject = memberDataService.GetObjectsFromJSON(reqO, 'RosterTypeCode', rosterTypeCode); // (object, Key, Value)  
                  $scope.titleHeaderParam.title = rosterObject[0].RosterTitle;
                  $scope.rosterTypeCode = rosterTypeCode;
                  //=================================== FETCH DATA
                  $scope.expandViewDetails(rosterTypeCode, 1, $scope.requestParameters);
              }
	          //===== FETCH SUB DETAILS 
              $scope.expandViewDetails = function (rosterType, viewLevel, criteriaObject, rosterRow) {
                  console.log('====@EXPAND VIEW DETAILS ROSTER:' + rosterType + ' LEVEL:' + viewLevel);

                  $scope.currentRow = rosterRow; //used for expanding upon data retrieval 
                  if (rosterRow != undefined) {
                      if (rosterRow.expand) {
                          //Already open, close
                          $('.expanded-header').removeClass('expanded-header');
                          rosterRow.expand = false;
                          return;
                      } else { //Cache items 
                          if (rosterRow.data != undefined) {

                              $scope.currentRow.expand = true;
                              return;
                          }
                          if (rosterRow.rosterSubViewLevel2 != undefined) {

                              $scope.currentRow.expand = true;
                              return;
                          }
                          if (rosterRow.rosterSubViewLevel3 != undefined) {

                              $scope.currentRow.expand = true;
                              return;
                          }
                      }
                  }

                  console.log('NOT OPEN... FETCH DATA');


                  $scope.dataResultMessageTier1 = null;
                  $scope.dataResultMessageTier2 = null;
                  $scope.dataResultMessageTier3 = null;
                  $scope.dataResultMessageTier4 = null;

                  console.log('@EXPANDROSTERDETAILS > roster:' + rosterType + ':' + rosterType + ' viewLevel:' + viewLevel);

                  //=================== BASE REQUEST PARAMETERS FOR SPECIFIC ENDPOINT
                  $scope.requestParameters = {}; //Init

                  //var reqO = memberDataService.WebServiceEndpointDefinitionObject[$scope.WSEDO];
                  var reqO = memberDataService.getWebServiceObject($scope.WSEDO);
                  var rosterObject = memberDataService.GetObjectsFromJSON(reqO, 'RosterTypeCode', rosterType); // (object, Key, Value)  
                  var reqParams = memberDataService.GetObjectsFromJSON(rosterObject, 'ViewLevel', viewLevel)[0].RequiredParams;
                  $scope.requestParameters = memberDataService.GetObjectsFromJSON(rosterObject, 'ViewLevel', viewLevel)[0].Params;

                  //Check for required parameter defined in WSEDO 
                  if (reqParams.hasOwnProperty('ProviderTaxId'))
                      $scope.requestParameters.ProviderTaxId = $rootScope.ProviderTaxID;

                  //Add or Update New criteria not available in base Object
                  jQuery.each(criteriaObject, function (i, val) {
                      $scope.requestParameters[i] = val;
                  });

                  $scope.currentViewLevel = viewLevel;



                  $scope.loading = true;
                  // console.log('@GetRosterSubViewDetails GET ROSTER DETAILS  ');

                  memberDataService.GetRosterSubViewDetails($scope.WSEDO, $scope.rosterTypeCode, viewLevel, JSON.stringify($scope.requestParameters)).success(function (data) {
                      $scope.loading = false;
                      // console.log('@GetRosterSubViewDetails RECEIVED ROSTER DETAILS  ');


                      switch ($scope.currentViewLevel) {
                          case 1:
                              $scope.data = data;
                              // console.log('DATA LIST COUNT1:' + data.ListMetaData.TotalListCount);
                              if (data.ListMetaData.TotalListCount === 0) {
                                  // console.log('SET MSG2');
                                  $scope.dataResultMessageTier1 = "No Data Available";
                              }
                              break;
                          case 2:
                              $scope.currentRow.rosterSubViewLevel2 = data;
                              //console.log('DATA LIST COUNT2:' + data.ListMetaData.TotalListCount);
                              if (data.ListMetaData.TotalListCount === 0) {
                                  // console.log('SET MSG2');
                                  $scope.currentRow.dataResultMessageTier2 = "No Data Available for " + $scope.currentRow.ProviderFName + ' ' + $scope.currentRow.ProviderLName;
                              }
                              break;
                          case 3:
                              $scope.currentRow.rosterSubViewLevel3 = data;
                              // console.log('DATA LIST COUNT3:' + data.ListMetaData.TotalListCount);
                              if (data[0] != undefined) {
                                  if (data[0].CareplanInsertDate !== undefined) {
                                      $scope.currentRow.rosterSubViewLevel3 = data[0];

                                  }
                              } else {
                                  if (data.ListMetaData.TotalListCount != undefined) {
                                      if (data.ListMetaData.TotalListCount === 0) {
                                          //console.log('SET MSG3');
                                          $scope.currentRow.dataResultMessageTier3 = "No Data Available for " + $scope.currentRow.MemberFName + ' ' + $scope.currentRow.MemberLName;
                                      }
                                  }
                              }


                              break;
                          case 4:
                              $scope.rosterSubViewLevel4 = data;
                              // console.log('DATA LIST COUNT4:' + data.ListMetaData.TotalListCount);
                              //  if (data.ListMetaData.TotalListCount === 0)
                              //      $scope.rosterSubViewLevel4.dataResultMessageTier4 = "No Data Available";
                              break;
                      }

                      if ($scope.currentRow != undefined) {
                          $scope.currentRow.expand = true;
                          // console.log('>>>EXPAND ROW');
                      }



                  }).error(function () {
                      console.log('@GetRosterSubViewDetails ERROR GETTING DETAILS! ');
                      $scope.loading = false;
                      $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                  });

              }
              
              //===== RETRIEVE LIST
              $state.go('urgentcarelistPartial');  
              $scope.RetrieveRoster($scope.rosterTypeCode, 1, ""); 

	}
})();