(function() {
    var app = angular.module('MemberPortalServices');
    /*******************************************************************
     * * * * * * * * * * * * * * *  INTERCEPTOR * * * * * * * * * * * * * 
     *******************************************************************/

    app.factory('dataInterceptorService', ['$q', '$location', 'authStatusService', function ($q, $location, authStatusService) {

        var authInterceptorServiceFactory = {
        };

        var _request = function (config) {

            config.headers = config.headers || {
            };

            //Retreive Token and set into headers
            if (authStatusService.getStatus().isAuth) {
                if (config.headers["X-Make-Anonymous"]) {
                    delete config.headers["X-Make-Anonymous"];
                } else {
                    config.headers.Authorization = 'Bearer ' + authStatusService.getStatus().access_token;
                }
            }



            return config;
        };

        var _responseError = function (rejection) {
            if (rejection.status === 401) {

                //authStatusService.fillAuthData();

                if (authStatusService.getStatus().isAuth) {
                    var requestedPath = $location.path();
                    $location.path('App/NotAuthorized').search('url', requestedPath);
                } else {
                    $location.path('App/Account/Login');
                }
            }
            return $q.reject(rejection);
        };

        authInterceptorServiceFactory.request = _request;
        authInterceptorServiceFactory.responseError = _responseError;

        return authInterceptorServiceFactory;
    }]);

    /********************************************************************************/
    /********************************************************************************/
})();