(function() {
	var app = angular.module('MemberPortalServices');


	app.factory('authService', [
		'$http', '$rootScope', '$q', 'transformRequestAsFormPost', '$location', '$resource', 'authStatusService', 'memberDataService', 'localStorageService', '$state', '$timeout', 'actionService',
		function ( $http, $rootScope, $q, transformRequestAsFormPost, $location, $resource, authStatusService, memberDataService, localStorageService, $state, $timeout, actionService ) {
			var authService = {};

			//var urlBase = '/AuthStatus';
			var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
			urlBase = $('meta[name="authServiceBase"]').attr('content');

			var serviceBase = $('meta[name="dataServiceBase"]').attr('content');

			var formPostHeaders = function() {
			    return {
			        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
			        "X-Requested-With": undefined
			    };
			};


			/*******************************************************************
			* * * * * * * * * * * * * * *  REGISTRATION * * * * * * * * * * * * 
			*******************************************************************/
			
			var RegistrationStepOne = function(params) {
				return $http({
					method: 'POST',
					url: urlBase + 'api/Registration/EligibilityCheck',
					data: params,
                    headers: formPostHeaders(),
					transformRequest: transformRequestAsFormPost
				});
			};

			var RegistrationStepTwo = function(params) {
				return $http({
					method: 'POST',
					url: urlBase + 'api/Registration/Register',
					data: params,
					headers: formPostHeaders(),
					transformRequest: transformRequestAsFormPost
				});
			};

			var RegistrationStepThree = function(params) {
				return $http({
					method: 'POST',
					url: urlBase + 'api/Registration/VerifyEmailCode',
					data: params,
					headers: formPostHeaders(),
					transformRequest: transformRequestAsFormPost
				});
			};

			var RegistrationStepFour = function(params) {
				return $http({
					method: 'POST',
					url: urlBase + 'api/Registration/SubmitSecurityQuestions',
					data: params //,
					//transformRequest: transformRequestAsFormPost
				});
			};

			/********************************************************************************/
			/********************************************************************************/


			/*******************************************************************
			* * * * * * * * * * * * * * *  AUTHENTICATION * * * * * * * * * * * * * 
			*******************************************************************/

			var _login = function(loginData) {
				console.log('@@_LOGIN');
				loginData.grant_type = 'password';
				//JCAST loginData.name = "WebMemberPortal";
				loginData.name = 'ProviderPortal'; // TEST JC PROVPORT 


				var deferred = $q.defer();

				$http({
						method: 'POST',
						url: urlBase + 'token',
						data: loginData,
						headers: formPostHeaders(),
						transformRequest: transformRequestAsFormPost
					})
					.success(function(response) {
						/*
						*===================== SIGNED IN OK 
						*/

						authStatusService.storeAuthResponse(response);
						authStatusService.SetTokenIntoCookie();


						var fullName = authStatusService.getStatus().claims.providername;
						$rootScope.firstName = fullName; //firstName + ' ' + lastName;

						if (authStatusService.getStatus().isAuth) {
							console.log('..ISAUTHOK');

							//=================== JCASTRO
							//=================== CONTENT AUTHORIZATION
							// var myRoles = ["CPC"]; //Authorizations Received & in Cookie from initial Token request
							// var myInclusionAccess = "P0,P2.NAV1";
							// var myExclusionAccess = "P3, P4.PA1, P4.V4, P2.NAV2"; //Received & in Cookie 


							//var JSONClientAuthorization = JSON.parse(authStatusService.getStatus().claims.authorization.replace(/'/g, '"'));
							var JSONClientAuthorization = JSON.parse(JSON.stringify(eval('(' + authStatusService.getStatus().authorizations + ')')));

							myRoles = JSONClientAuthorization.roles;
							myInclusionAccess = JSONClientAuthorization.inclusions;
							myExclusionAccess = JSONClientAuthorization.exclusions;


							localStorageService.set('RoleAcc', myRoles);
							localStorageService.set('IncAcc', myInclusionAccess);
							localStorageService.set('ExcAcc', myExclusionAccess);


							// TEST CLAIMS TOKEN AVAILABILITY
							console.log('JTI:' + authStatusService.getStatus().claims.jti);

							//LegacyLoginService.establish();

							deferred.resolve(response);
							$state.go('home');
							$rootScope.$broadcast( 'logon-success' );
					
						} else {
							console.log('..ISAUTH NOT OK');
							deferred.reject('The user name or password is incorrect.');
						}
					}).error(function(err, status) {

						if (!err) {
							err = {};
						}

						err.status_code = status;
						deferred.reject(err);
					});

				return deferred.promise;
			};

			var _logOut = function() {
			    authStatusService.status = authStatusService.getStatus();

			    //If authenticated, init, else clear
			    if (authStatusService.status.isAuth) {
			        //Revoke Token
			        var jti = authStatusService.getStatus().claims.jti;
				    _SignTokenOut(jti).success(function(data) {
					    //Success
				    }).error(function() {
					    console.log('@AuthServ.STO ERROR');
				    });
			    }
				//Clear Everything From Local Storage
				authStatusService.clearAll();
				//LegacyLoginService.terminate();

				//Broadcast logged-out event
				$rootScope.$broadcast('logged-out');

				//Redirect to Login Page
				var urlBase = $('meta[name="ApplicationRoot"]').attr('content'); //Shadows urlBase with Application urlBase
				//$location.path(urlBase + "/App/Account/Login");
				$state.go('login');
			};

			//SignTokenOut
			var _SignTokenOut = function(jti) {
				var params = {
					jti: jti
				};
				return $http.post(urlBase + 'api/account/RevokeToken', params);
			};

			var _refreshToken = function() {
				//authStatusService

				var deferred = $q.defer();

				var status = authStatusService.getStatus();
				var param = {};
				param.grant_type = 'refresh_token';
				param.refresh_token = status.refresh_token;
				param.session_id = status.claims.sessionid;
				var refreshUrl;
				// check if the token was issued via internalAccess or not, if not we will get the refresh token the regular way

				refreshUrl = urlBase + 'api/InternalUser/InternalUserLoginRequest';
                //if (status.claims.internaluser == '') {
				//	// endpoint for refresh token for regular login:
				//	refreshUrl = urlBase + 'token';
				//} else {
				//	// new endpoint for refresh token via internalAccess app:
				//	refreshUrl = urlBase + 'api/InternalUser/InternalUserLoginRequest';
				//}

				$http({
						method: 'POST',
						url: refreshUrl,
						data: param,
						transformRequest: transformRequestAsFormPost,
						headers: {
						    "X-Make-Anonymous": 'true',
						    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
						    "X-Requested-With": undefined
						}
					})
					.success(function(response) {
						var status = authStatusService.storeAuthResponse(response);
						deferred.resolve(status);
					}).error(function(err, status) {
						deferred.reject(err);
					});

				return deferred.promise;
			};


			//============================================== PROCESS LOGIN TOKEN
			//Process authString
			var _processLoginToken = function(token) {

				var deferred = $q.defer();
				authStatusService.clearAll();

				var authResponseObj = JSON.parse(UTF8ArrToStr(base64DecToArr(token)));
				var accessToken = { access_token: authResponseObj.access_token };
				var strAuth = authResponseObj.authorizations.replace(/'/g, '"');
				var clientAuthorization = JSON.parse(strAuth);
				myRoles = clientAuthorization.roles;
				myInclusionAccess = clientAuthorization.inclusions;
				myExclusionAccess = clientAuthorization.exclusions;
				localStorageService.set('RoleAcc', myRoles);
				localStorageService.set('IncAcc', myInclusionAccess);
				localStorageService.set('ExcAcc', myExclusionAccess);
				authStatusService.storeAuthResponse(accessToken);
				//authStatusService.SetTokenIntoCookie(); //needed?

				$rootScope.firstName = authStatusService.getStatus().claims.providername;
				$rootScope.userName = authStatusService.getStatus().claims.username;
				$rootScope.usertypeName = authStatusService.getStatus().claims.usertypename; //Owner
				$rootScope.ProviderType = authStatusService.getStatus().claims.providertype;

				$rootScope.$broadcast('authStatusUpdated');
				$rootScope.$broadcast('logon-success');
				deferred.resolve();

				return deferred.promise;
			};

			var broadcastResults = function() {
				$rootScope.$broadcast('authStatusUpdated');
			};

			/********************************************************************************/
			/********************************************************************************/


			/*******************************************************************
			* * * * * * * * * * SIMPLE AUTHORIZATION RESOLVE * * * * * * * * * * 
			*******************************************************************/

			//http://www.codeproject.com/Tips/811782/AngularJS-Security-Authorization-on-Angular-Routes
			//http://odetocode.com/blogs/scott/archive/2014/05/20/using-resolve-in-angularjs-routes.aspx

			var _AuthenticationCheck = function(roleCollection) {

				// var d = new Date();
				// var n = d.getTime();
				// console.log('CALLED AUTH CHECK @ t='+ n);

				var deferred = $q.defer();

				//authStatusService.fillAuthData();

				authStatusService.status = authStatusService.getStatus();


				$timeout(function() {
					if (authStatusService.status.isAuth) {
						deferred.resolve();
					} else {

						$state.go('login');
						deferred.reject();
					}

				});

				return deferred.promise;


			};

			var _getAuthenticationStatus = function(deferred) {

				authStatusService.status = authStatusService.getStatus();


				$timeout(function() {
					if (authStatusService.status.isAuth) {
						deferred.resolve();
					} else {

						$state.go('login');
						deferred.reject();
					}

				});

				return deferred.promise;

				//if (authStatusService.status.isAuth) {
				//    deferred.resolve();
				//} else {
				//    //If user does not have required access, we will route the user to unauthorized access page
				//    //$location.path('App/Account/Login');
				//    $state.go('login');
				//    //As there could be some delay when location change event happens, 
				//    //we will keep a watch on $locationChangeSuccess event
				//    // and would resolve promise when this event occurs.
				//    //$rootScope.$on('$locationChangeSuccess', function (next, current) {
				//    //    deferred.resolve();
				//    //});
				//    deferred.reject();
				//    $state.go('login');
				//}
			};

			/********************************************************************************/
			/********************************************************************************/


			/*******************************************************************
			* * * * * * * * * * * * * * *  AUTHORIZATION * * * * * * * * * * * * * 
			*******************************************************************/

			var roles = {
				"yay": 0,
				"boo": 1,
				"bar": 2
			};

			var _permissionModel = {
				permission: {},
				isPermissionLoaded: false
			};

			//var _permissionCheck = function (allowRoles, denyRoles) {
			//    // we will return a promise .
			//    var deferred = $q.defer();

			//    //this is just to keep a pointer to parent scope from within promise scope.
			//    var parentPointer = this;

			//    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');

			//    //Checking if permission object(list of roles for logged in user) is already filled from service
			//    if (_permissionModel.isPermissionLoaded) {
			//        //Check if the current user has required role to access the route
			//        _getPermission(_permissionModel, allowRoles, denyRoles, deferred);
			//    } else {
			//        //if permission is not obtained yet, we will get it from  server.
			//        // 'api/permissionService' is the path of server web service , used for this example.

			//        //$http.$get(urlBase + '/api/Utilities').success(
			//        $http.get(urlBase + '/api/Utilities/GetRoles').success(function (response) {
			//            //when server service responds then we will fill the permission object
			//            _permissionModel.permission = response;

			//            //Indicator is set to true that permission object is filled and 
			//            //can be re-used for subsequent route request for the session of the user
			//            _permissionModel.isPermissionLoaded = true;

			//            //Check if the current user has required role to access the route
			//            _getPermission(_permissionModel, allowRoles, denyRoles, deferred);
			//        });
			//    }
			//    return deferred.promise;
			//};

			//var _getPermission = function (permissionModel, allowRoles, denyRoles, deferred) {
			//    var ifPermissionPassed = false;

			//    angular.forEach(allowRoles, function (role) {
			//        switch (role) {
			//            case roles.yay:
			//                if (permissionModel.permission.isSuperUser) {
			//                    ifPermissionPassed = true;
			//                }
			//                break;
			//            case roles.boo:
			//                if (permissionModel.permission.isAdministrator) {
			//                    ifPermissionPassed = true;
			//                }
			//                break;
			//            case roles.bar:
			//                if (permissionModel.permission.isUser) {
			//                    ifPermissionPassed = true;
			//                }
			//                break;
			//            default:
			//                ifPermissionPassed = false;
			//        }
			//    });

			//    if (ifPermissionPassed) {
			//        angular.forEach(denyRoles, function (role) {
			//            switch (role) {
			//                case roles.yay:
			//                    if (permissionModel.permission.isSuperUser) {
			//                        ifPermissionPassed = false;
			//                    }
			//                    break;
			//                case roles.boo:
			//                    if (permissionModel.permission.isAdministrator) {
			//                        ifPermissionPassed = false;
			//                    }
			//                    break;
			//                case roles.bar:
			//                    if (permissionModel.permission.isUser) {
			//                        ifPermissionPassed = false;
			//                    }
			//                    break;
			//            }
			//        });
			//    }

			//    if (!ifPermissionPassed) {
			//        //If user does not have required access, we will route the user to unauthorized access page
			//        //$location.path(routeForUnauthorizedAccess);
			//        var requestedPath = $location.path();
			//        $location.path('App/NotAuthorized').search('url', requestedPath);
			//        //As there could be some delay when location change event happens, 
			//        //we will keep a watch on $locationChangeSuccess event
			//        // and would resolve promise when this event occurs.
			//        $rootScope.$on('$locationChangeSuccess', function (next, current) {
			//            deferred.resolve();
			//        });
			//    } else {
			//        deferred.resolve();
			//    }
			//};


			/********************************************************************************/
			/********************************************************************************/


			/*******************************************************************
			* * * * * * * * * * * * * CHANGE PASSWORD * * * * * * * * * * * * * 
			*******************************************************************/

			var _ChangePassword = function(param) {
				return $http.post(urlBase + 'api/Account/ChangePassword', param);
			};

			/********************************************************************************/
			/********************************************************************************/


			/*******************************************************************
			* * * * * * * * * * * * * CHANGE EMAIL * * * * * * * * * * * * * 
			*******************************************************************/

			var _ChangeEmail = function(param) {

				//    //var ParameterModel = {
				//    //    UserName : 'username here',
				//    //    Password : 'current password here',
				//    //    NewEmail : 'new email here',
				//    //    ConfirmEmail: 'confirm email here',
				//    //    name : 'WebMemberPortal'
				//    //}

				return $http.post(urlBase + 'api/Account/ChangeEmail', param);
			};

			/********************************************************************************/
			/********************************************************************************/


			/*******************************************************************
			* * * * * * * * * * * * *  PASSWORD RESET * * * * * * * * * * * * * 
			*******************************************************************/

			var _InitiatePasswordReset = function(params) {

				//    //var ParameterModel = {
				//    //    SubscriberNumber : 'username here',
				//    //    Email : 'users email here',
				//    //    DateOfBirth : 'members date of birth here',
				//    //    PcpPinCode : 'members pcp pin code here'
				//    //}

				return $http({
					method: 'POST',
					url: urlBase + 'api/Account/Provider/ResetPassword',
					data: params
				});
			};


			var _VerifyEmailCode = function(params) {
				return $http({
					method: 'GET',
					url: urlBase + 'api/Registration/Provider/VerifyEmailAddress?verificationCode=' + params.verificationCode + '&userName=' + params.userName
				});
			};


			var _SubmitSecurityQuestionAnswer = function(params) {
				return $http({
					method: 'POST',
					url: urlBase + 'api/Account/Provider/ConfirmSecurityQuestions',
					data: params
				});
			};

			var _SubmitNewPassword = function(params) {
				return $http({
					method: 'POST',
					url: urlBase + 'api/Account/ChangePassword',
					data: params
				});

			};

			/********************************************************************************/
			/********************************************************************************/


			/*******************************************************************
			* * * * * * * * * * * *  SECURITY QUESTIONS * * * * * * * * * * * *
			*******************************************************************/

			var _registerOwnerAccount = function(params) {
				var urlWebService = urlBase + 'api/Registration/Provider/RegisterOwnerAccount';
				console.log('POST >', urlWebService, params);
				return $http.post(urlWebService, params);
			};

			var _getAllQuestions = function() {
				return $http({
					method: 'GET',
					url: urlBase + 'api/Account/GetAllQuestions'
				});
			};


			var _submitQuestions = function(param) {
				return $http({
					method: 'POST',
					url: urlBase + 'api/Registration/Provider/SubmitSecurityQuestions',
					data: param
				});
			};

			var _confirmEmail = function(params) {
				return $http({
					method: 'GET',
					url: urlBase + 'api/Account/Provider/ConfirmEmail?verificationCode=' + params.verificationCode + '&userName=' + params.userName
				});
			};
			/********************************************************************************/
			/********************************************************************************/


			authService.broadcastResults = broadcastResults;

			//Log-in / Log-out / Refresh Token
			authService.login = _login;
			authService.logOut = _logOut;
			authService.refreshToken = _refreshToken;
			authService.processLoginToken = _processLoginToken;

			////Register
			authService.VerifyEmailCode = _VerifyEmailCode;
			//authService.submitRegistration = RegistrationStepTwo;       //Register
			//authService.VerifyMemberData = RegistrationStepOne;         //EligCheck
			//authService.RegistrationStepOne = RegistrationStepOne;      //EligCheck
			//authService.RegistrationStepTwo = RegistrationStepTwo;      //Register
			//authService.RegistrationStepThree = RegistrationStepThree;  //Verify Email Code
			//authService.RegistrationStepFour = RegistrationStepFour;    //SubmitSecurityQuestions
			authService.RegisterOwnerAccount = _registerOwnerAccount;
			////Password Reset
			authService.ResetPassword = _InitiatePasswordReset;
			authService.ConfirmEmail = _confirmEmail;

			authService.ConfirmSecurityQuestions = _SubmitSecurityQuestionAnswer;
			authService.ChangePassword = _SubmitNewPassword;

			//Change Password
			authService.ChangePassword = _ChangePassword;

			//Change Email
			authService.ChangeEmail = _ChangeEmail;

			//Check Authentication Status
			authService.AuthenticationCheck = _AuthenticationCheck;

			////Authorization/Permission
			//authService.roles = roles;
			//authService.permissionCheck = _permissionCheck;

			////Security Questions
			authService.getAllQuestions = _getAllQuestions;
			authService.SubmitSecurityQuestions = _submitQuestions;

			authService.ChangeSecurityQuestions = function ( params ) {
				var urlWebService = urlBase + 'api/account/ChangeSecurityQuestions';
				console.log('POST >', urlWebService, params);
				return $http.post(urlWebService, params);
			};
			//authService.getUserQuestions = _getUserQuestions;


			//authService.test = _test;

			return authService;

		}
	]);

})();