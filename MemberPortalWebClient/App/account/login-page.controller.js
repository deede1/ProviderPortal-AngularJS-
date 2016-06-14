(function() {
	'use strict';

/* Login Page */
	angular
		.module('MemberPortal')
		.controller('loginPageController', loginPageController);
	///////////
	loginPageController.$inject = ['$scope', '$rootScope', '$translate', '$stateParams', 'authStatusService', '$location', 'authService', 'memberIDCardService', '$state'];

	function loginPageController($scope, $rootScope, $translate, $stateParams, authStatusService, $location, authService, memberIDCardService, $state) {
		$scope.alert = '';
		$scope.username = '';
		$scope.password = '';
		$scope.showResetForm = false;

		checkReferral();

		////////////////////////////
		function checkReferral() {
			if ($stateParams.referral === 'registration') {
				$scope.alert = 'Success! You are now registered. Please sign in.';
			}
			if ( $stateParams.referral === 'changePassword' ) {
				$scope.alert = 'Success! Your password has been updated. Please sign in.';
			}
		}

		$scope.changeLanguage = function(key) {
			if ($scope.currentLanguage !== key) {
				$translate.use(key);
				$scope.currentLanguage = key;
				var date = new Date();
				var m = 10 * 60 * 24 * 30 * 6;
				date.setTime(date.getTime() + (m * 60 * 1000));
				$.cookie('__APPLICATION_LANGUAGE', key, {
					expires: date,
					path: '/'
				});

				$('html').attr('lang', key);
				$rootScope.currentLanguage = key;
				$rootScope.$broadcast('language-change', key);
				$('.selectedLanguage').removeClass('selectedLanguage');
			}
		};

		//========== LANGUAGE
		var requestedLanguage = $stateParams.lang;

		//default language, use existing cookies, or proceed w init cookie as normal
		//Check if desired language is passed
		if (requestedLanguage != undefined) {
			if (requestedLanguage.toLowerCase() == 'es') {
				$scope.changeLanguage('es-mx');
			} else {
				$scope.changeLanguage('en-us');
			}
		}


		//Decode authString
		if ($location.search().authString) {
		    authService.processLoginToken($location.search().authString).then(function () {
		        $stateParams.authString = null;
		        //$state.go('home', $stateParams, { 'location': 'replace', 'inherit': false, 'relative': $state.$current, 'notify': true, 'reload': 'home' });

		        $state.reload( 'home' );
			});
		}


	}


})();