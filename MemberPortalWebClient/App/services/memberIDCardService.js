(function () {
    var app = angular.module('MemberPortalServices');

    app.factory('memberIDCardService', ['$http',  '$rootScope', 'memberDataService','localStorageService','$q',
        function ($http,   $rootScope, memberDataService, localStorageService, $q) {
            var memberIDCardService = {};
        // factory function body that constructs shinyNewServiceInstance

            memberIDCardService.GetMemberTempCardImage = function () {
         
            var deferred = $q.defer();

                memberDataService.GetTempMemberIDCardImage().success(
                     function (IEHPTemporaryIDCardImageObject ) {
                         var args = {};
                          
 
                         if (IEHPTemporaryIDCardImageObject.ResponseStatus == "Success") {
                             console.log('MEMCARD : SUCCESSFULLY RETURNED');
                             //Make available to rendering variable 
                             $rootScope.IEHPTemporaryIDCardFrontSide   = IEHPTemporaryIDCardImageObject.FrontSide;
                             $rootScope.IEHPTemporaryIDCardBackSide    = IEHPTemporaryIDCardImageObject.BackSide; 
                             $rootScope.ShowMemberIDCard = true;
                             $rootScope.IEHPTemporaryIDCardFetchStatus = IEHPTemporaryIDCardImageObject.ResponseStatus;
                           
                             //ID Card stored in session Storage
                             localStorageService.set('IDC_front', IEHPTemporaryIDCardImageObject.FrontSide);
                             localStorageService.set('IDC_back', IEHPTemporaryIDCardImageObject.BackSide); 
                             localStorageService.set('IDC_fetchStatus', IEHPTemporaryIDCardImageObject.ResponseStatus);

                            // $scope.$broadcast('asdasd', args);
                             $rootScope.$broadcast('IDCardFetched', args);
                             deferred.resolve();
                         }
                         else {//200 Response, but no image 
                             console.log('MEMCARD : 200 BUT NO IMAGE RETURNED');
                             $rootScope.IEHPTemporaryIDCardFetchStatus =  IEHPTemporaryIDCardImageObject.ResponseStatus;
                             localStorageService.set('IDC_fetchStatus',  IEHPTemporaryIDCardImageObject.ResponseStatus);
                             $rootScope.$broadcast('IDCardFetched', args);
                             // console.log('ERROR > NO IMAGE RETURNED');
                            //  $rootScope.$broadcast('IDCardFetchingError',args);
                         }
                
                      
                     }).error(function () {
                         console.log('MEMCARD : ERROR WITH REQUEST!!!');
                         $rootScope.IEHPTemporaryIDCardFetchStatus = "ERROR";
                         // console.log('ERROR_FETCHINGCARDIMAGE');
                         //   $rootScope.$broadcast('IDCardFetchingError',args);
                         deferred.reject();
                     });
                return deferred.promise; 
            };





            return memberIDCardService;
    }]);
})();


