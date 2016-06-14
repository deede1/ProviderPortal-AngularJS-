(function() {
	var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

	angular
		.module('MemberPortal', [
			'customFilters',
			'ngCookies',
			'pascalprecht.translate',
			'angulartics',
			'ui.router',
			'angular.filter',
			'angulartics.google.analytics',
			'ngAnimate',
			'ui.bootstrap',
			'720kb.datepicker',
			'angularMoment',
			'hljs',
			'DeveloperTool',
			'surveyClient',
			'ngMask',
            'checklist-model',
			// App specific
			'MemberPortalDirectives',
			'MemberPortalServices'
		])
		.config([
			'$compileProvider', function($compileProvider) {
			    $compileProvider.debugInfoEnabled(false); //Set to false for production
			}
		])
		.config(languageConfig)
		.config(hljsConfig)
		.config(developerToolConfig)
	    .run(['authService', '$state', function (authService, $state) {
	        var jwt = $('meta[name="InternalLoginToken"]').attr('content');
	        if (jwt) {
	            authService.processLoginToken(jwt).then(function () {
	                $('meta[name="InternalLoginToken"]').remove();
	                $state.go('home');
	            });
	        }
	    }]);


        //Set Environment Constants
	    angular.module('MemberPortal').constant('environmentConfig', {
            dataServiceBaseUri: $('meta[name="dataServiceBase"]').attr('content'),
            authServiceBaseUri: $('meta[name="authServiceBase"]').attr('content'),
            legacyPortalBaseUri: $('meta[name="legacyPortalBaseUri"]').attr('content'),
            appRoot: $('meta[name="ApplicationRoot"]').attr('content')
         });

    


	//============== LANGUAGE TRANSLATION
	languageConfig.$inject = ['$translateProvider'];

	function languageConfig($translateProvider) {
		//LOAD via WEBAPI
		//  $translateProvider.useUrlLoader('/ws/englishspanish.json');
		//Load via File
		$translateProvider.useStaticFilesLoader({
			prefix: 'Languages/',
			suffix: '.txt' + cacheBust
		});
	}

	hljsConfig.$inject = ['hljsServiceProvider'];

	function hljsConfig(hljsServiceProvider) {
		hljsServiceProvider.setOptions({
			// replace tab with 2 spaces
			tabReplace: '  ',
			useBR: false

		});
	}

	//======= DeveloperTool's
	developerToolConfig.$inject = ['dataInspectorProvider'];

	function developerToolConfig(dataInspectorProvider) {
		dataInspectorProvider.enableDataInspector(true); //TODO: Use the meta data tag in the head to set this value.
	};

})();