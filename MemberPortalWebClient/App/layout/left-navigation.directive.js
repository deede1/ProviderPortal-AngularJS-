(function () {
    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

    var app = angular.module('MemberPortalDirectives');

    app.directive("leftNavigation", function () {
        return {
            scope:  false,
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/layout/left-navigation.directive.html' + cacheBust,
            controller: 'leftNavController'
        };
    });


    app.controller('leftNavController', [
        '$scope', '$rootScope', '$compile', 'contentAuthorizationService', function ($scope, $rootScope, $compile, contentAuthorizationService) {
          
            $scope.siteItem = [];
            $scope.siteItem = contentAuthorizationService.processContentAuth('HOME'); 
            $scope.clickedOnItem = function() { 
                $rootScope.$broadcast('clearResults');  
            };
         
        }]);


})();