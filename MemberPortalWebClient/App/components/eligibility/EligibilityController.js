(function() { 
    'use strict';
	angular
		.module('MemberPortal')
		.controller('EligibilityController', EligibilityController);

	EligibilityController.$inject = ['$scope', '$rootScope', '$filter',
        '$state', '$stateParams', 'contentAuthorizationService', 'memberDataService', '$translate'];

	function EligibilityController($scope, $rootScope, $filter,
        $state, $stateParams, contentAuthorizationService, memberDataService, $translate) {
	 
            console.log('@@==== ELIG CONTROLLER CGC:' + $state.$current.resolve.params[0]().CGC);
	    $scope.siteItem = [];
	    $scope.siteItem = contentAuthorizationService.processContentAuth($state.$current.resolve.params[0]().CGC);
 
	    $scope.loadingSearchResults = false; 
               $scope.errorMessage = "";
               $scope.infoMessage = "";
               $scope.successMessage = "";
               $scope.data = {};
               $scope.TestUserMode = $rootScope.TestUserMode;
               $scope.ShareDataWithState = 1; //On by default 
               $scope.SSNSearch = false;
               $scope.DateOfService = false;
               $scope.IEHPID_DOS_date = new Date(); 
               $scope.isLastNameSearch = false;
               $scope.isSSNCINIEHPIDSearch = false;
               $scope.expandMemberSearchBox = true;  

      
               $scope.addNewSearchRow = function () {
                   //formAddButton
                   console.log('@@> ADD NEW SEARCHROW');
                   var newItem = $('#newSearchRow').clone();
                   var searchBoxIndex = parseInt($('.eligibiltyMemberSearchTxtBox').length) + 1;  
                   newItem.removeClass('hideTemporarily').attr('id', 'rowEligSearch_' + searchBoxIndex); 
                   // Input Textboxes
                   newItem.find('#txtEligSearch_0').attr('id', 'txtEligSearch_' + searchBoxIndex).attr('itemIndex', searchBoxIndex);
                   newItem.find('#txtEligDOS_0').attr('id', 'txtEligDOS_' + searchBoxIndex);
                   newItem.find('#txtEligDOB_0').attr('id', 'txtEligDOB_' + searchBoxIndex);
                   // Date Containers
                   newItem.find('#contEligDOS_0').attr('id', 'contEligDOS_' + searchBoxIndex);
                   newItem.find('#contEligDOB_0').attr('id', 'contEligDOB_' + searchBoxIndex);
                   // Close Buttons
                   newItem.find('#btnEligClose_0').attr('id', 'btnEligClose_' + searchBoxIndex).attr('onclick', 'removeSearchItem(' + searchBoxIndex + ')');

                   $(newItem).find('input').removeAttr('istemplate');
                   var searchButtonDetached = $('.formAddButton').detach(); //#eligAddSearchButton
                   $('#eligSearchBy').prepend(searchButtonDetached);
                   $('#eligSearchBy').prepend(newItem);
                   $('#txtEligSearch_' + searchBoxIndex).focus();
                   $(newItem).bind('paste', function (e) {
                       addNewRowSearchItem();
                   });

               };


               //================== VALIDATE ELIGIBILITY FORM
               $scope.validateEligibilityForm = function () {
                   var response = { validForm: false, item: [] };
                   console.log('VALIDATING FORM  Invalids=' + $('input[name="txtEligDOB"].eligInvalidValue').length);

                   //Dates
                   if ($('input[name="txtEligDOB"].eligInvalidValue').length > 0) {
                       console.log('FALSE ');
                       response.item.push('You entered an invalid birth-date');
                   } else {
                       console.log('TRUE ');
                       response.validForm = true;
                   }

                   //Search Criteria
                   if ($('input[name="eligibiltyMemberSearchTxtBox"][searchType=""]').length > 0) {
                       console.log('FALSE ');
                       response.item.push('You entered invalid search criteria');
                   } 

                   return response; 
               }

               $scope.$on('eligibilityResponseReceived', function () {
                   $scope.loadingSearchResults = false;
               });


               //=================== SUBMIT ELIGIBILITY SEARCH 
               $scope.submitEligibilitySearch = function () {
                   
                   $scope.loadingSearchResults = true;
            
                   console.log('@@========== SUBMIT ELIG SEARCH');
                
                   var validationObject = $scope.validateEligibilityForm();

                   var replaceSpaces = / /gi;

                   if (validationObject.validForm) {


                       //DISABLE FOR TESTING jumpToAnchor('eligRes');
                       var listJsonObjects = [];
                       $("input[name='txtEligSearch']").each(function (i) {
                           if ($(this).val().length > 0 && $(this).attr('searchType') !== '') {
                               var itemIndex = $(this).attr('itemIndex');
                               console.log(' SEARCHTYPE:' + $(this).attr('searchType') + ' VAL:' + $(this).val() + ' DOS:' + $('#txtEligDOS_' + itemIndex).val() + ' DOB:' + $('#txtEligDOB_' + itemIndex).val());

                               var item;
                               if ($(this).attr('searchType') == 'LastNameAndDateOfBirth') {
                                   item = {
                                       //Properties are as Per API 
                                       value: $(this).val().replace(replaceSpaces, ''),
                                       dateOfService: $('#txtEligDOS_' + itemIndex).val(),
                                       dateOfBirth: $('#txtEligDOB_' + itemIndex).val(),
                                       type: $(this).attr('searchType')
                                   }
                               } else {
                                   item = {
                                       value: $(this).val(),
                                       dateOfService: $('#txtEligDOS_' + itemIndex).val(),
                                       type: $(this).attr('searchType')
                                   }

                               }

                               listJsonObjects.push(item);
                           }
                       });

                       var searchType = "MULTIPLE";
                       var searchValue = "";
                       var searchDateOfService = "";
                       var searchDateOfBirth = "";
                       console.log('... SEARCH TYPE:' + searchType);
                        
                       var params = {
                           SearchType: searchType,
           
                           JSONObject: listJsonObjects
                       }
                       console.log('... eligibility INVOKING STATE GO  Search   ITEMS: (' + listJsonObjects.length + ')');


                      $state.go('eligibility.searchresults', params);
 

                   } else {

                       var invalidFormMessage = 'Please resolve the following items:<br><br><ul>';
                       $.each(validationObject.item, function (key, value) {
                           invalidFormMessage += '<li>' + value + '</li>';
                       });
                       invalidFormMessage += "</ul>";

                       $scope.openMessageModal(0, 0, 'Invalid Request', invalidFormMessage);
                   }




               };

               $scope.openMessageModal = function (w, h, title, message) {
                   $('#modalContainerGeneral').addClass('modalEligibilityDetail').attr('modalClass', 'modalEligibilityDetail').fadeIn('fast');
                   $('#bakModal').fadeIn('slow');
                   var html_out = "<div><h2 class='ppTitle ppSearchResults'><span class='glyphicon glyphicon-exclamation-sign'></span> " + title + "</h2> <span>" + message + "</span> </div>";
                   $('.modalContent').empty().html(html_out);

               }
        
               $scope.viewMemberDetails = function (firstName, lastName, iehpID, address1, address2, city, state, zip, phone, language) {
                   console.log('@VIEW MEM DETAILS for :' + firstName);
                   $('#modalContainerGeneral').addClass('modalEligibilityDetail').attr('modalClass', 'modalEligibilityDetail').fadeIn('fast');
                   $('#bakModal').fadeIn('slow');
                   $('.modalContent').empty();
                   phone = phone.length == 0 ? 'Not Available' : phone;

                   $rootScope.$broadcast('updatePPEligibilityMemberDetails', {
                       FirstName: firstName,
                       LastName: lastName,
                       IEHPID: iehpID,
                       Address1: address1,
                       Address2: address2,
                       City: city,
                       State: state,
                       Zip: zip,
                       Phone: phone,
                       Language: language
                   });
               };
        
               $scope.viewPCPDetails = function (inItem) {
 

                   console.log('...VIEW PCP DETAILS FOR ' + inItem.PcpName);

                   $('#bakModal').fadeIn('slow');
                   $('.modalContent').empty();
     

                   $rootScope.$broadcast('updatePPEligibilityPCPDetails', {
                       item: inItem
                   });
               };

               $scope.openIframeModal = function (url, modalClass) {
                
                       $('.modalFrameContainer').addClass(modalClass).attr('modalClass', modalClass).fadeIn('fast');
                       $('#bakModal').fadeIn('slow');
                       $('.modalFrameContainer .modalFrame').addClass('ppIframe_' + modalClass).attr('src', url).load(function () { 
                              $('#modalFrameContainerGeneral').fadeIn('slow');
                         });
               }
        
               $scope.viewAssignedIPA = function (IPA, hospitalID) {
                   console.log('@VIEWASSIGNED IPA');
                   var url = 'https://www.iehp.org/Secure_Site/Eligibility/Scripts/billing.asp?IPA=' + IPA + '&hosp=' + hospitalID + '&DOS=' + $scope.getTodaysDate();
                   console.log("URL:" + url);
                   $scope.openIframeModal(url, 'modalEligibilityBillingInfo');
               };

               $scope.viewAssignedHospital = function (IPA, hospitalID) {
                   var url = 'https://www.iehp.org/Secure_Site/Eligibility/Scripts/billing.asp?IPA=01I&hosp=02&DOS=12%2F08%2F2015';
                   $scope.openIframeModal(url, 'modalEligibilityBillingInfo');
               };

               $scope.viewUrgentCareList = function (iehpID) {
                   var url = '/urgentcarelist'; // API list will be created by Istvan 
                   $scope.openIframeModal(url, 'modalEligibilityUrgentCareList');
               };

               $scope.viewMemberMedicalHistory = function (iehpID, DOS) {
                   var date = new Date(DOS);
                   var dateFormatted = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
                   //var url = 'https://www.iehp.org/Secure_Site/MedicalRecord/EMR/forms/EMR.asp?id=' + iehpID + '&dos=' + dateFormatted + '&verif=8292544';
                   var url = 'memberhealthrecord?iehpId=' + iehpID;
                   $scope.openIframeModal(url, 'modalEligibilityMedicalHistory');
                  // $state.go('memberHealthRecord', { iehpID: iehpID });
               };

               $scope.viewCarePlansHRA = function (iehpID) {
                   var url = '/rosters/health-management/care-management-report/partial';
                   $scope.openIframeModal(url, 'modalEligibilityCarePlansHRA');
               };
        

        
               $scope.removeEligibilityItem = function (itemID) {
                   console.log('removing >>' + itemID);
                   $('#' + itemID).remove();
               };

               $scope.getTodaysDate = function () {
                   var today = new Date();
                   var dd = today.getDate();
                   var mm = today.getMonth() + 1; //January is 0!
                   var yyyy = today.getFullYear();
                   if (dd < 10) {
                       dd = '0' + dd;
                   }
                   if (mm < 10) {
                       mm = '0' + mm;
                   }
                   today = mm + '/' + dd + '/' + yyyy;
                   return today;

               };
 



               $scope.$on('obfuscation_toggled', function () {
                   $scope.TestUserMode = $rootScope.TestUserMode;

                   $state.go($state.current, {}, { reload: true }); //second parameter is for $stateParams
               });
          

	 
	}
})();