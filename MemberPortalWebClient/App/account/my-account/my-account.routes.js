(function() {
	'use strict';

	angular
		.module('MemberPortal')
		.config(myAccountStateConfig);

	var urlBase = $('meta[name="ApplicationRoot"]').attr('content'),
			cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

	//use this helper function to minimize repeated code in the routes
	function url(url) {
		return urlBase + url + cacheBust;
	}

	///////////////
	myAccountStateConfig.$inject = ['$stateProvider'];  

	function myAccountStateConfig($stateProvider) {
		$stateProvider
			.state('my-account', {
				url: '/account/my-account',
				views: {
					'': { templateUrl: url('/App/layout/two-column-wide-right.html') },
					'navigation@my-account': { templateUrl: url('/App/account/my-account/my-account-navigation.html'), controller: 'MyAccountNavigationController' },
					'content@my-account': { templateUrl: url('/App/account/my-account/my-account.html') }
				}
			})
			.state('my-account.change-password', {
				url: '/change-password',
				views: {
					'content@my-account': { templateUrl: url('/App/account/my-account/change-password.html'), controller: 'ChangePasswordController' }
				}
			})
			.state('my-account.change-email', {
				url: '/change-email',
				views: {
					'content@my-account': { templateUrl: url('/App/account/my-account/change-email.html'), controller: 'ChangeEmailController' }
				}
			})
			.state('my-account.change-questions', {
				url: '/change-questions',
				views: {
					'content@my-account': { templateUrl: url('/App/account/my-account/change-questions.html'), controller: 'ChangeQuestionsController' }
				}
			})
			.state('my-account.sub-user-accounts', {
				url: '/sub-user-accounts',
				views: {
					'content@my-account': { templateUrl: url('/App/account/my-account/sub-user-accounts.html'), controller: 'SubUserAccountsController' }
				}
			});

	}

})();