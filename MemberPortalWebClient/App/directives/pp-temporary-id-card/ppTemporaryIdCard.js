(function () {

    var app = angular.module('MemberPortalDirectives');
    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    app.directive("ppTemporaryMemberIdCard", function () {
        return {
            scope: {
                elig: '=',
                testUserMode: '='
            },
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/directives/pp-temporary-id-card/ppTemporaryIdCard.html',
            controller: 'ppTemporaryIdCardController' 
        };
    });

    app.controller('ppTemporaryIdCardController', ['$scope', '$rootScope', '$compile', 'memberDataService', 'localStorageService', '$q',
        function ($scope, $rootScope, $compile, memberDataService, localStorageService, $q) {
          
            $scope.loadingTempMemberIDCard = true;
            $scope.ShowMemberIDCard = false;
            $scope.showPrintIcons = true; 

            //======= LISTENER TO FETCH CARD
            $scope.$on('fetchMemberTemporaryIDCard', function(event, paramObject) {
                console.log('@@ DIRECTIVE LISTENER $ON SUB: ' + paramObject.IEHPID);
                var paramObject = {
                    subscriberNumber: paramObject.IEHPID,
                    lob: paramObject.LOB
                }
                $scope.GetMemberTempCardImage(paramObject);
            }); 

            //========  Fetch temporary loading images
            $scope.GetMemberTempCardImage= function(paramObject, displayInModalClass) {
                var deferred = $q.defer(); 
                $('#bakModal').fadeIn('slow');
                $('.modalContent').empty(); 

                // Display the Temp Card View content while fetching actual image 
                $('#modalContainerGeneral').fadeIn('fast');
                $('.modalContainer').addClass('modalMemberIDCard').attr('modalClass', 'modalMemberIDCard').fadeIn('fast'); 
                $scope.IEHPTemporaryIDCardFrontSide = "";
                $scope.IEHPTemporaryIDCardBackSide = "";
                $scope.ShowMemberIDCard = false;
                $scope.loadingTempMemberIDCard = true; 
                setTimeout(function() {
                    var a = $('#eligibilitySearchResultsMemberIDCard').clone();
                    $('.memCardIDImage').attr('src', '');
                    a.attr('id', '');
                    $(a).appendTo('#modalContainerGeneral .modalContent'); 
                    $('#modalContainerGeneral .modalContent #eligibilitySearchResultsMemberIDCard').show();
                }, 50);
    


                memberDataService.GetTempMemberIDCardImage(paramObject).success(
                     function (IEHPTemporaryIDCardImageObject) { 
                         $scope.loadingTempMemberIDCard = false;
                         var args = {};  
                         if (IEHPTemporaryIDCardImageObject.ResponseStatus == "Success") {

                             //Prepare Card Expiration Date (at end of month)
                             var today = new Date();
                             var expDate = new Date();
                             $scope.formatDate = function (inDate) {
                                 var dd = inDate.getDate();
                                 var mm = inDate.getMonth() + 1; //January is 0!
                                 var yyyy = inDate.getFullYear();
                                 if (dd < 10) {
                                     dd = '0' + dd;
                                 }
                                 if (mm < 10) {
                                     mm = '0' + mm;
                                 }
                                 today = mm + '/' + dd + '/' + yyyy;
                                 return today;
                             }
                             expDate = new Date(expDate.getFullYear(), expDate.getMonth() + 1, 0);
                             $scope.todaysDate = $scope.formatDate(today);
                             $scope.expirationDate = $scope.formatDate(expDate); // Last day of month

                             //Make available to rendering variable 
                             $scope.IEHPTemporaryIDCardFrontSide = IEHPTemporaryIDCardImageObject.FrontSide;
                             $scope.IEHPTemporaryIDCardBackSide = IEHPTemporaryIDCardImageObject.BackSide;
                             $scope.ShowMemberIDCard = true;
                             $scope.IEHPTemporaryIDCardFetchStatus = IEHPTemporaryIDCardImageObject.ResponseStatus;  

                             //Timer for image to refresh
                             setTimeout(function () {
                                 console.log('@ TIME TO REFRESH CARD IN UI');
                                  var a = $('#eligibilitySearchResultsMemberIDCard').clone();
                                 $('#modalContainerGeneral .modalContent').html(''); //Clear content from previous Loader view above
                                 $(a).appendTo('#modalContainerGeneral .modalContent'); 
                                  $('#modalContainerGeneral .modalContent #eligibilitySearchResultsMemberIDCard').show();
                                  }, 50);  
                             deferred.resolve();
                         }
                         else {//200 Response, but no image 
                      
                             console.log('ERROR > NO IMAGE RETURNED');  
                         } 
                     }).error(function () { 
                         console.log('ERROR > FETCHINGCARDIMAGE'); 
                         deferred.reject();
                     });
                return deferred.promise; 
        };

    }]);
})();
