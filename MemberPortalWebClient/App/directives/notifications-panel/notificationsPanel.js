(function() {
    var app = angular.module('MemberPortalDirectives');


    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' +$('meta[name="templateCacheBust"]').attr('content');

    app.directive("notificationsPanel", function() {
        return {
            scope: {

            },
            restrict: "EA",
            //replace: true,      
            templateUrl: urlBase + '/App/directives/notifications-panel/notificationsPanel.html' + cacheBust,
            controller: 'notificationsPanelCtrl',
            controllerAs: 'ctrl'
        };
    });


    app.filter('excludeFrom', [function() {
        return function(inputArray, filterCriteria) {
            return inputArray.filter(function(item) {
                // if the value of filterCriteria is "falsy", retain the inputArray as it is
                // then check if the currently checked item in the inputArray is different from the filterCriteria,
                // if so, keep it in the filtered results
                return !filterCriteria || !angular.equals(item, filterCriteria);
            });mem
        };
    }]);

    app.controller('notificationsPanelCtrl', ['$scope','$rootScope', '$filter', 'authService', '$location', 'dialogs', '$state',
        function ($scope, $rootScope, $filter, authService, $location, $dialogs, $state) {


       //console.log('... @NOTIFPANEL' );

        //$scope.SubscriberNumber = "201407030192";
        //$scope.DateOfBirth = "1969-10-16";
        //$scope.PinCode = "000000017771";
        //$scope.Email = "kepke-b@iehp.org";
        //$scope.Password = "Password#00";
        //$scope.LastFour = "9431";

        $scope.errorMessage = "";
        $scope.infoMessage = "";
 
        $scope.isAuthorizedPerson = false;
        $scope.isOpenAccessMember = false; 
        $scope.currentLanguage = "";
 
 
 

        $scope.reloadRoute = function() {
            //$route.reload();
            $state.go($state.current, {}, { reload: true }); //second parameter is for $stateParams
        };
             
 
       
 

        /*************************************************************
         * * * * * * * * * * * * Culture Switching * * * * * * * * * *
         *************************************************************/
        $scope.currentCulture = $.cookie("__APPLICATION_LANGUAGE");
        $scope.currentLanguage = $scope.currentCulture.substring(0, 2);

        $scope.$on('language-change', function (event, key) {
            $scope.currentCulture = key;
            $scope.currentLanguage = key.substring(0, 2);

            //Swap All Questions List
            // _extractQuestionsByCulture();
        });
        /**********************************************************/
        /**********************************************************/

 
   
 
 
  

        ////Help Modal
        //$scope.showHelpModal = function (type) {
        //    var dlg = {};
        //    switch (type) {
        //        case 'IEHPMemID':  dlg = $dialogs.notify($filter("translate")("form_help_modal_title_whereToFindYourMemberID"), '<center class="overflowAuto"><img src="Content/Images/IEHPMemCard_memIDv2.png"></center>'); break;
        //        case 'PCPPinCode': dlg = $dialogs.notify($filter('translate')('form_help_modal_title_whereToFindYourPCPPinCode'), '<center  class="overflowAuto"><img src="Content/Images/IEHPMemCard_pcpCode.png"></center>'); break;
        //    }
        //};


        $scope.GetMemberNotifications = function (language) {
            //memberDataService.GetMemberNotifications(language).success(function (alertList) {
            //    $scope.alertList = alertList;
            //    $scope.loading = !$scope.loading;
            //    if (alertList != '')
            //        $scope.haveNotifications = true;
            //    $scope.errorMessage = "";

            //}).error(function () {
            //    // console.log('@notifications... error?');
            //    $scope.loading = !$scope.loading;
            //    $scope.errorMessage = $filter('translate')('form_unableToRetrieveData');
            //});
        }

        $scope.GetMemberNotifications($rootScope.currentLanguage.substring(0, 2));
 

     

    }]);

})();