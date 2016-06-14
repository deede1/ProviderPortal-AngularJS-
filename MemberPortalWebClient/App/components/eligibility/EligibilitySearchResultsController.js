(function() {
	'use strict';

	angular
		.module('MemberPortal')
		.controller('EligibilitySearchResultsController', EligibilitySearchResultsController);

	EligibilitySearchResultsController.$inject = ['$scope', '$state', '$stateParams', '$location', '$window',
        '$rootScope', '$filter', 'memberDataService', '$translate',
        'contentAuthorizationService', 'memberIDCardService'];

	function EligibilitySearchResultsController($scope, $state, $stateParams, $location, $window,
            $rootScope, $filter, memberDataService, $translate,
            contentAuthorizationService, memberIDCardService) {
                console.log('@@ELIGIBILITYSEARCHRESULTSCONTROLLER');
                $scope.showPrintIcons = true;
                $scope.displayResults = false;
                $scope.loadingSearchResults = false;
                $scope.memberNotificationsList = [];

	    $scope.ProviderType = $rootScope.ProviderType;
         

                $scope.$on('clearResults', function () {
                    console.log('@ESRC - CLEAR RESULTS ');
                    $scope.displayResults = false;

                });
       
	    //====== TITLE/ HEADER
                $scope.titleHeaderParam = {
                    title: 'Search Results',
                    displayFullView: false,
                    displayImportExport: false,
                    displayViewOptionFull: false,
                    displayViewOptionGrouped: false 
                };

       
	    //$scope.openNewWindowTab = function(inURL) {

	    //    var newTab = $window.open(inURL, '_blank');
	    //    newTab.focus();
	    //}

	    //===== MEMBER CARD ID
                $scope.viewMemberIDCard = function (in_IEHPID, in_LOB) {

                    var requestObject = {
                        IEHPID: in_IEHPID.substring(0, 12),
                        LOB: in_LOB
                    }  
                    $rootScope.$broadcast('fetchMemberTemporaryIDCard', requestObject, 'paramObject'); 
                };



	    //===== FETCH MEMBER NOTIFICATIONS
                $scope.fetchEligibilityNotifications = function(membersList) {
                    var i;
                    for ( i = 0; i <= membersList.length-1; i++) {

                        console.log('retrieving:' + membersList[i].IehpId);

                        if (membersList[i].IehpId !==null) {
                            memberDataService.GetEligibilityNotifications(membersList[i].IehpId).success(function(data) {

                                    $scope.memberNotificationsList[data.SubscriberNumber] = data.AsthmaProgram == true ? ', Asthma Program' : '';
                                    $scope.memberNotificationsList[data.SubscriberNumber] += data.CaliforniaChildServices == true ? ', California Child Services' : '';
                                    $scope.memberNotificationsList[data.SubscriberNumber] += data.ComplexCareManagement == true ? ', Complex Care Management' : '';
                                    $scope.memberNotificationsList[data.SubscriberNumber] += data.LandmarkEligible == true ? ', Landmark Eligible' : '';
                                    $scope.memberNotificationsList[data.SubscriberNumber] += data.ShowElectronicHealthRecord == true ? ', Show Electronic Health Record' : '';
                                    $scope.memberNotificationsList[data.SubscriberNumber] = $scope.memberNotificationsList[data.SubscriberNumber].replace(',', '');
                                }
                            ).error(function() {
                                $scope.loading = false;
                                console.log('!!!! ERROR FOR NOTIFS >' + $scope.errorMessage);
                                $scope.NotificationsErrorMessage = 'NOTIFICATIONS ERROR: Unfortunately we were not able to retrieve Notification Information at this time.';
                            });
                        }

                    }
                     return membersList;

                }
	    //===== FETCH ELIGIBILITY DATA
                $scope.SearchEligibilty = function(searchType, SearchValue, DateOfService, DateOfBirth, JSONObject) {

                    if (searchType !== null) {
                        console.log('... @SEARCHELIGIBILITY SEARCHTYPE :' + searchType + ' SEARCHVALUE=' + SearchValue + ' DOS: ' + DateOfService + ' DOB:' + DateOfBirth + ' JSONOBJECT:' + JSONObject.toString());
                        $scope.loadingSearchResults = true;
                        $scope.data = null;
                        $scope.errorMessage = '';

                        memberDataService.PPGetEligibility('ELIG_' + searchType, JSON.stringify(JSONObject)).success(function(data) {


                            $scope.loadingSearchResults = false;
                            $stateParams.JSONObject = null;
                            $scope.displayResults = true;
                            $rootScope.$broadcast('eligibilityResponseReceived');
                            console.log('@ROSTER DETAIL VIEW CONTROLLER  SUCCESS!!');
                            if (data != null && data.VerificationId !== 'Error') {
                                //Successful retrieval 
                                if (data.length !== 0) {
                                    console.log('...DATA NOT NULL');
                                    $scope.data = data.Result;
                                    $scope.verificationID = data.VerificationId;
                                    var date = new Date();
                                    $scope.timeStamp = $filter('date')(date, 'h:mm a');
                                    $scope.dateStamp = $filter('date')(date, 'MM/dd/yyyy');
                                    $('.resultsHeaderVerificationID').delay(25000).fadeIn('slow').removeClass('hidden');
                                    $scope.fetchEligibilityNotifications($scope.data);

                                } else {
                                    $scope.errorMessage = ' No Results Found for Your Criteria.';
                                    $scope.showPrintIcons = false;
                                }
                            } else {
                                $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                            }
                        }).error(function() {
                            $scope.loading = false;
                            console.log('!!ERROR!!');
                            $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                            console.log('!!!' + $scope.errorMessage);
                        });
                    }


                }

                //console.log('@@ ELIG SEARCH RES CONTRLLER type:' + $stateParams.SearchType + ' >' + $stateParams.SearchValue + ' >>' + $stateParams.DateOfService + " >>>" + $stateParams.DateOfBirth); //DateOfService);


                if ($stateParams.JSONObject !== null) {
                    $scope.DateOfBirth = $stateParams.JSONObject[0].dateOfBirth;
                    $scope.SearchEligibilty($stateParams.JSONObject[0].type, $stateParams.JSONObject[0].value, $stateParams.JSONObject[0].dateOfService, $stateParams.JSONObject[0].dateOfBirth, $stateParams.JSONObject);

                }
 
	}
})();