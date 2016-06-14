(function () {
    var app = angular.module('MemberPortalServices');


    app.factory('LegacyLoginService', ['$http', '$rootScope', '$q', 'transformRequestAsFormPost', 'authStatusService', 'environmentConfig', function ($http, $rootScope, $q, transformRequestAsFormPost, authStatusService, environmentConfig) {
		    var svc = {};

		    /*******************************************************************
            * * * * * * * * * *  Common Local Variables * * * * * * * * * * * * 
            *******************************************************************/


		    var legacyEnvironment = environmentConfig.legacyPortalBaseUri + "legacy-portal-security/",
		        authServerEnvironment = environmentConfig.authServiceBaseUri;

		    /*******************************************************************
            * * * * * * * * * * * * * Event Listeners * * * * * * * * * * * * *
            *******************************************************************/

		    $rootScope.$on('logon-success', function (event) {
		        //Establish Legacy Session
		            //establishLegacySessionAjax();
		            establishLegacySessionHttp();
		    });
		    $rootScope.$on('logged-out', function (event) {
		        //Terminate Legacy Session
		            terminateLegacySessionHttp();
		            //terminateLegacySessionAjax();
		    });

            
		    /*******************************************************************
            * * * * * * * * * * * * * * Methods * * * * * * * * * * * * * * * *
            *******************************************************************/

		    //Function to post JWT to legacy endpoint
		    var establishLegacySessionAjax = function () {

		        var status = authStatusService.getStatus();

		        var jwt = status.access_token;
		        
		        var rqst = $http({
		            method: 'POST',
		            url: legacyEnvironment + 'sendRequest.asp',
		            data: {
		                "AuthServerEnvironment": authServerEnvironment,
		                "JwtToken" : jwt
		            },
		            headers: {
		                "X-Make-Anonymous" : true,
		                "X-Requested-With": undefined,
		                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
		            },
		            transformRequest: transformRequestAsFormPost
		        })
                .then(
                    function () {
                        console.log('legacy session establish success');
                    },
                    function () {
                        console.log('legacy session establish fail');
                    }
                );
		    };
            
            //Function to kill session via legacy endpoint
		    var terminateLegacySessionAjax = function () {
		        $http.get('/terminate_session.asp')
                    .then(
                        function () { console.log('legacy session termination success'); },
                        function () { console.log('legacy session termination fail'); }
                    );
		    };

		    var establishLegacySessionHttp = function() {
		        
		        var status = authStatusService.getStatus();

		        var path = legacyEnvironment + 'sendRequest.asp',
		            params = [
		                { 'name':'JwtToken', 'value':status.access_token },
                        { 'name':'AuthServerEnvironment', 'value':authServerEnvironment }
		            ];

		        httpForm(path, params);
		    };

		    var terminateLegacySessionHttp = function () {
		        httpForm(legacyEnvironment + 'terminate_session.asp', null);
		    };




		    var httpForm = function (path, params, method) {
		        method = method || "post";

		        var el = document.getElementById('legacy-login-form');
		        if (el) {
		            el.remove();
		        }
		        el = document.getElementById('legacy-login-frame');
		        if (el) {
		            el.remove();
		        }

		        var form = document.createElement("form");
		        form.setAttribute("method", method);
		        form.setAttribute("action", path);
		        form.setAttribute("style", "display:none;");
		        form.setAttribute("target", "legacy-login-frame");
		        form.setAttribute("id", "legacy-login-form");

		        var iframe = document.createElement("iframe");
		        iframe.setAttribute("name", "legacy-login-frame");
		        iframe.setAttribute("style", "display:none;");
		        iframe.setAttribute("id", "legacy-login-frame");
		        

		        //Move the submit function to another variable
		        //so that it doesn't get overwritten.
		        form._submit_function_ = form.submit;

		        for (var key in params) {
		            if (params.hasOwnProperty(key)) {
		                var hiddenField = document.createElement("input");
		                hiddenField.setAttribute("type", "hidden");
		                hiddenField.setAttribute("name", params[key].name);
		                hiddenField.setAttribute("value", params[key].value);
		                form.appendChild(hiddenField);
		            }
		        }
                //Appends the elements, submit, and set iframe to complete
		        document.body.appendChild(form);
		        document.body.appendChild(iframe);
		        form.submit();
		    };

		    /*******************************************************************
            * * * * * * * * * * * Attach Public Methods * * * * * * * * * * * * 
            *******************************************************************/
		    /* example: svc.foo = _foo; */

            //Service Preferred Defaults
		    svc.establish = establishLegacySessionHttp;
		    svc.terminate = terminateLegacySessionHttp;

            //Methodology Explicit
		    svc.establishHttp = establishLegacySessionHttp;
		    svc.terminateHttp = terminateLegacySessionHttp;
		    svc.establishAjax = establishLegacySessionAjax;
		    svc.terminateAjax = terminateLegacySessionAjax;
		    return svc;

		}
    ]);

})();
