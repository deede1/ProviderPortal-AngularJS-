(function () {

    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

    var app = angular.module('MemberPortalDirectives');
   

    app.directive("languageTabs", function () {
        return {
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/directives/_language-tabs/languageTabs.html' + cacheBust,
            controller: 'langTabsCtrl',
            controllerAs: 'ctrl',
            link: function (scope, el, attr) {

            }
        };
    });
    app.controller('langTabsCtrl', ['$scope', '$rootScope', 'requestedLanguageService', '$filter', '$translate', 'authService', '$location', 'authStatusService',
        function ($scope, $rootScope, requestedLanguageService, $filter, $translate, authService, $location, authStatusService) {

            $scope.urlBase = urlBase;
            $scope.currentLanguage = $rootScope.currentLanguage;

            $scope.swapLanguage = function (newLang) { 
                requestedLanguageService.changeLanguage(newLang);
                $scope.currentLanguage = newLang;
                $rootScope.currentLanguage;
            } 
    }]);
})();