(function () {
    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

    var app = angular.module('MemberPortalDirectives');

    app.directive("leftNavigationP4p", function () {
        return {
            scope:  false,
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/layout/left-navigation-p4p.directive.html' + cacheBust,
            controller: 'p4pLeftNavigation'
        };
    });


    app.controller('p4pLeftNavigation', [
        '$scope', '$rootScope', '$compile', '$state','contentAuthorizationService', function ($scope, $rootScope, $compile,$state, contentAuthorizationService) {


            console.log('@P4P LEFT NAV CONTROLLER');


        }]);


})();