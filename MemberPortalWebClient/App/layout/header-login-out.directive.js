( function () {

	var urlBase = $( 'meta[name="ApplicationRoot"]' ).attr( 'content' );
	var cacheBust = '?v=' + $( 'meta[name="templateCacheBust"]' ).attr( 'content' );

	var app = angular.module( 'MemberPortalDirectives' );

	app.directive( "loginPartial", function () {
		return {
			restrict: "EA",
			//replace: true,
			templateUrl: urlBase + '/App/layout/header-login-out.directive.html' + cacheBust,
			controller: 'loginPartialCtrl',
			controllerAs: 'ctrl',
			link: function ( scope, el, attr ) {

			}
		};
	} );
	app.controller( 'loginPartialCtrl', ['$scope', '$rootScope', '$filter', '$state', '$translate', 'authService', '$location', 'authStatusService', 'localStorageService', 'memberDataService',
			function ( $scope, $rootScope, $filter, $state, $translate, authService, $location, authStatusService, localStorageService, memberDataService ) {

				$scope.urlBase = urlBase;
				$scope.TestUserMode = $rootScope.TestUserMode;
				$scope.actions = {};

				memberDataService.GetUserActions().success( function ( data ) {
					console.log( 'user actions >', data );
					$scope.actions.data = data;
					$scope.actions.count = data.length;

				} );
			


				var updateAuthStatus = function () {
					authStatusService.status = authStatusService.getStatus();
					$scope.isAuth = authStatusService.status.isAuth;


					if ( authStatusService.status.isAuth ) {

						$( '#divSignInSignOut' ).css( 'display', 'block' );
						$( '#langCont' ).css( 'display', 'block' );

						console.log( '@@JTI ADDED > ' + authStatusService.status.claims.jti );
						$rootScope.jti = authStatusService.status.claims.jti;
						$rootScope.ProviderNumber = authStatusService.status.claims.providernumber;
						$rootScope.ProviderTaxID = authStatusService.status.claims.providertaxid;
						console.log( '-------------PROV TAX ID:' + authStatusService.status.claims.providertaxid );

						$rootScope.firstName = authStatusService.getStatus().claims.providername;
						$rootScope.userName = authStatusService.getStatus().claims.username;
						$rootScope.usertypeName = authStatusService.getStatus().claims.usertypename;//Owner
						$rootScope.ProviderType = authStatusService.getStatus().claims.providertype;
						console.log( '-------------PROV TYPE:' + authStatusService.getStatus().claims.providertype );

						$scope.userName = authStatusService.getStatus().claims.username;
						$scope.firstName = authStatusService.getStatus().claims.username;

					}
				};

				$scope.$on( 'authStatusUpdated', function () {
					updateAuthStatus();
				} );


				$rootScope.$on( 'obfuscation_toggled', function () {
					$scope.TestUserMode = $rootScope.TestUserMode;
					//$route.reload();
					$state.go( $state.current, {}, { reload: true } ); //second parameter is for $stateParams
				} );

				$scope.login = function () {
					$location.path( urlBase + '/App/Account/Login' );
				};
				$scope.logOut = function () {

					$( '#divSignInSignOut' ).css( 'display', 'none' );
					$( '#langCont' ).css( 'display', 'none' );

					//This will log the user out, but It's not doing everything I want right now...

					authService.logOut();
					authStatusService.status = authStatusService.getStatus();
					$scope.isAuth = authStatusService.status.isAuth;
					$scope.userName = authStatusService.status.userName;

					//This stuff doesn't work the way I wanted.
					//$location.path(urlBase + '/App/Account/Login');
					//$scope.$apply(function () { $location.path("/App/Account/Login"); });
					//$scope.$apply;
					//$scope.$apply(function () { $location.path("/App/Account/Login"); });
					//$location.html5Mode(true).path("/App/Account/Login");
					//$location.path(urlBase + '/App/Account/Login');
					//$locationProvider.html5Mode(true).hashPrefix('!');
					//$location.path(urlBase + '/App/Account/Login');
					//I think we also need some kind of broadcast to be triggered.
				};

				updateAuthStatus();

				$scope.$on( 'logged-out', function ( event ) {

					updateAuthStatus();
				} );

				$scope.$on( 'logon-success', function ( event ) {
					updateAuthStatus();
				} );

			}] );
} )();