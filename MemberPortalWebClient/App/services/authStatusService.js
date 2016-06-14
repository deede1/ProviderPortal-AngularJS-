(function () {
    var app = angular.module('MemberPortalServices');




    app.factory('authStatusService', ['$rootScope', 'localStorageService', '$location',function ($rootScope, localStorageService, $location) {
        var service = {};

        var _status = {
            isAuth: false,
            userName: ""
        };

        var _getStatus = function() {
            _fillAuthData();
            return _status;
        };

        var _clearAll = function () {
            _clearTokenFromCookie();
            localStorageService.remove('loginState');
            //ID Card Image
            //Not needed for NewProvider Portal
            //localStorageService.remove('IDC');
            //localStorageService.clearAll();
            //localStorageService.cookie.clearAll();

            _fillAuthData();
        };

 

        var _storeAuthResponse = function (response) {
            response.local_issue_time = new Date();
            localStorageService.set('loginState', response);
            return _status;
        };

        var _fillAuthData = function () {        
           // console.log('@FILLAUTHDATA > getting LoginState from LocalStorage');

            var authData = localStorageService.get('loginState');

            try {//Check for valid loginState value
                if (authData == '' || authData == null) {
                 
                    localStorageService.remove('loginState');
                    localStorageService.remove('RoleAcc');
                    localStorageService.remove('IncAcc');
                    localStorageService.remove('ExcAcc');



                    //Remove ID Card Image
                    localStorageService.remove('IDC');
                    throw "anonymous";
                }
        

                _status.claims = JSON.parse(UTF8ArrToStr(base64DecToArr(authData.access_token.split('.')[1])));
                _status.isAuth = true;
                _status.userName = authData.userName;
                _status.expires_in = authData.expires_in;
                _status.access_token = authData.access_token;
                _status.refresh_token = authData.refresh_token;
                _status.issued = authData[".issued"];
                _status.expires = authData[".expires"];
                _status.local_issue_time = authData.local_issue_time;
                _status.audience = authData.audience;
                _status.authorizations = authData.authorizations;

                
                //Check if Expired
                var expirationDate = new Date(_status.claims.exp * 1000);
                var timeRemaining = expirationDate - new Date();  //Difference in miliseconds
                if (timeRemaining <= 0) {
                    console.log('...EXPIRED!');
           
                    throw "expired";

                } else {
                    //Check if Valid
                    if (!_status.claims.jti) {
                        console.log('...INVALID!');
                   
                        throw "invalid";
                    } else {
                        return _status;
                    }
                }


            } catch (e) {
 
                 
                localStorageService.remove('loginState');
                localStorageService.remove('RoleAcc');
                localStorageService.remove('IncAcc');
                localStorageService.remove('ExcAcc');
                //ID Card Image
                sessionStorage.removeItem('IDC');

                _status = {
                    isAuth: false,
                    userName: ""
                };
            }
            return _status;
        };


        var _setTokenIntoCookie = function() {
            var status = _getStatus();
            localStorageService.cookie.set('token', status.access_token);
            return true;
        };

        var _clearTokenFromCookie = function() {
            localStorageService.cookie.remove('token');
            return true;
        };

        service.storeAuthResponse = _storeAuthResponse;
        service.fillAuthData = _fillAuthData;
        service.status = _status;
        service.getStatus = _getStatus;
        service.clearAll = _clearAll;

        service.SetTokenIntoCookie = _setTokenIntoCookie;
        service.ClearTokenFromCookie = _clearTokenFromCookie;

        return service;

    }]);

})();
