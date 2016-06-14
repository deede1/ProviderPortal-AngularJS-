( function () {
	var urlBase = $( 'meta[name="ApplicationRoot"]' ).attr( 'content' );
	var cacheBust = '?v=' + $( 'meta[name="templateCacheBust"]' ).attr( 'content' );
	var app = angular.module( 'MemberPortalDirectives' );

	// $('body').css({
	//     'background': 'url(Content/Images/lghtmesh.png) center center fixed' 
	// });

	app.directive( "loginForm", function () {
		return {
			restrict: "EA",
			//replace: true,
			templateUrl: urlBase + '/App/directives/account/login-form/loginForm.html' + cacheBust,
			controller: 'loginFormCtrl',
			controllerAs: 'ctrl'
		};
	} );

	app.controller( 'loginFormCtrl', ['$scope', '$rootScope', 'authService', '$location', 'authStatusService', 'dialogs', 'memberIDCardService', '$filter', '$translate', 'contentAuthorizationService',
			function ( $scope, $rootScope, authService, $location, authStatusService, $dialogs, memberIDCardService, $filter, $translate, contentAuthorizationService ) {
				$scope.loading = true;
				$scope.errorMessage = "";
				$scope.infoMessage = "";
				// $scope.item = [];




				if ( authStatusService.getStatus().isAuth ) {
					$( '#divSignInSignOut' ).css( 'display', 'block' );
					$( '#langCont' ).css( 'display', 'block' );

					console.log( '@LOGINFORMCTRL ISAUTH' );
					alert(33);
					$state.go( 'home' ); //Go to Homepage
				}



				$scope.changeLanguage = function ( key ) {
					if ( $scope.currentLanguage !== key ) {
						$translate.use( key );
						$scope.currentLanguage = key;
						var date = new Date();
						var m = 10 * 60 * 24 * 30 * 6;
						date.setTime( date.getTime() + ( m * 60 * 1000 ) );
						$.cookie( "__APPLICATION_LANGUAGE", key, {
							expires: date, path: '/'
						} );

						$( 'html' ).attr( "lang", key );
						$rootScope.currentLanguage = key;
						$rootScope.$broadcast( 'language-change', key );
						$( '.selectedLanguage' ).removeClass( 'selectedLanguage' );
					}
				}

				$scope.submit = function () {
					console.log( '@SUBMIT' );

					$scope.loading = !$scope.loading;
					$scope.errorMessage = "";
					console.log( '@@lLOGINFORM A>' + $scope.username + ' PASS >' + $scope.password );
					authService.login( { username: $scope.username, password: $scope.password } ).then( function () {
						//console.log('@@1 BEFORE FETCHING IMAGE');
						//memberIDCardService.GetMemberTempCardImage();

						//console.log('@@1 AFTER FETCHING IMAGE');
						$scope.loading = !$scope.loading;
						console.log( '@@lLOGINFORM B>' + $scope.username );
						//console.log('@THEN');

						$( '#divSignInSignOut' ).css( 'display', 'block' );
						$( '#langCont' ).css( 'display', 'block' );

					}, function ( response ) {
						$scope.loading = !$scope.loading;

						console.log( '@RESPONSE > ' + response.error );

						if ( response.error && response.error == 'temporary password' ) {
							$( '#bakModal' ).fadeIn( 'fast' );
							$scope.showResetForm = true;
						} else if ( response.error_description && response.error_description != '' ) {

							$scope.errorMessage = response.error_description;
						} else if ( +response.error === 0 ) {
							$scope.errorMessage = 'Too many failed login attempts. Please try again in 10 minutes.';
						} else if ( +response.error > 0 ) {
							$scope.errorMessage = 'Please make sure your password is correct. Attempts Remaining: ' + response.error;
						} else {
							$scope.errorMessage = $filter( 'translate' )( 'form_signInPage_wrongUserNamePassword' );
							//var dlg = $dialogs.notify('IEHP Member ID', ' Image here <img src="">');
						}
					} );
				};
			}] );
} )();