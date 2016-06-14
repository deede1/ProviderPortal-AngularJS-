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
			.state('registration', {
				url: '/account/registration',
				views: {
					'': { templateUrl: url('/App/account/registration/registration-home.html'), controller: 'RegistrationController' }
				}
			})
			.state('registration.registerForm', {
				url: '/register',
				views: {
					'innerView': { templateUrl: url('/App/account/registration/register-form.html'), controller: 'RegisterFormController' }
				}
			})
			.state('registration.verifyForm', {
				url: '/verify?verificationCode&userName',
				views: {
					'innerView': { templateUrl: url('/App/account/registration/verify-form.html'), controller: 'VerifyFormController' }
				}  
			})
			.state('registration.submitForm', {
				url: '/submit',
				views: {
					'innerView': {
						templateUrl: url('/App/account/registration/submit-form.html'),
						controller: 'SubmitFormController'
					}
				}
			});
	}

})();