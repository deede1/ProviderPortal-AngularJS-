(function() {
	'use strict';

	angular
		.module('MemberPortal')
		.config(config);

	var urlBase = $('meta[name="ApplicationRoot"]').attr('content'),
			cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

	//use this helper function to minimize repeated code in the routes
	function url(url) {
		return urlBase + url + cacheBust;
	}

	///////////////
	config.$inject = ['$stateProvider'];

	function config($stateProvider) {
		$stateProvider
			.state('password-reset', {
				url: '/account/password-reset',
				views: {
					'': {
						templateUrl: url('/App/account/password-reset/password-reset.html'),  
						controller: 'PasswordResetController'
					},
					'innerView@password-reset': {
						templateUrl: url('/App/account/password-reset/pr-step1.html'),
						controller: 'PrStep1Controller'
					}
				}
			})
			.state('password-reset.step2', {
				url: '/step2?verificationCode&userName',
				views: {
					'innerView@password-reset': {
						templateUrl: url('/App/account/password-reset/pr-step2.html'),
						controller: 'PrStep2Controller'
					}
				}
			})
			.state('password-reset.step3', {
				url: '/step3',
				views: {
					'innerView@password-reset': {
						templateUrl: url('/App/account/password-reset/pr-step3.html'),
						controller: 'PrStep3Controller'
					}
				}
			})
			.state('password-reset.step4', {
				url: '/step4',
				views: {
					'innerView@password-reset': {
						templateUrl: url('/App/account/password-reset/pr-step4.html'),
						controller: 'PrStep4Controller'
					}
				}
			});
	}

})();