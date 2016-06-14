(function () {
    var app = angular.module('MemberPortalServices'); 
    app.factory('requestedLanguageService', ['$rootScope', '$stateParams', '$translate',
    function ($rootScope, $stateParams, $translate) {
            var requestedLanguageService = {}; 
            requestedLanguageService.changeLanguage = function (key) {
  
                if ($rootScope.currentLanguage !== key) {
                    $translate.use(key);
                    $rootScope.currentLanguage = key;
                    var date = new Date();
                    var m = 10 * 60 * 24 * 30 * 6;
                    date.setTime(date.getTime() + (m * 60 * 1000));
                    $.cookie("__APPLICATION_LANGUAGE", key, {
                        expires: date, path: '/'
                    });

                    $('html').attr("lang", key);
                    $rootScope.currentLanguage = key;
                    $('.selectedLanguage').removeClass('selectedLanguage');
                    $rootScope.$broadcast('language-change', key);
                    
                }
            }

            //========== LANGUAGE
            var requestedLanguage = $stateParams.lang;

            //default language, use existing cookies, or proceed w init cookie as normal
            //Check if desired language is passed
            if (requestedLanguage != undefined) {
     
                if (requestedLanguage.toLowerCase() == 'es') {
                    requestedLanguageService.changeLanguage('es-mx');
                }
                else
                    requestedLanguageService.changeLanguage('en-us');
            }
            else {
          
                //======== COOKIE EXISTS?
                if ($.cookie("__APPLICATION_LANGUAGE") != undefined) { 
                }
                else { 
                    requestedLanguageService.changeLanguage('en-us');
                }
            }
        return requestedLanguageService; 
    }]);

})();
