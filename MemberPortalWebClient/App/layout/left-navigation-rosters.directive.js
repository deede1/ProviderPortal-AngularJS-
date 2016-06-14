(function () {
    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

    var app = angular.module('MemberPortalDirectives');

    app.directive("leftNavigationRosters", function () {
        return {
            scope:  false,
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/layout/left-navigation-rosters.directive.html' + cacheBust,
            controller: 'rostersLeftNavigation'
        };
    });


    app.controller('rostersLeftNavigation', [
        '$scope', '$rootScope', '$compile', '$state','contentAuthorizationService', function ($scope, $rootScope, $compile,$state, contentAuthorizationService) {



            //console.log('@@@CONTROLLER ============= ROSTER ');
            $scope.WSEDO = "Rosters";
            $scope.siteItem = [];
            $scope.siteItem = contentAuthorizationService.processContentAuth('ROST');
            //console.log('@@@CONTROLLER ============ >' + $scope.siteItem['ROST']);
     
            $scope.clickedOnItem = function() { 
                $rootScope.$broadcast('clearResults');

            };


        }]);


})();