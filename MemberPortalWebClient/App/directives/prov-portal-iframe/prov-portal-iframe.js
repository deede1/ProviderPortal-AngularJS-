(function () {
    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content'); 
    var app = angular.module('MemberPortalDirectives');
 
    app.directive("provPortalIframe", function () {
        return {
            scope: {
                pageurl: '@',
                pagetitle: '@',
                pageintro: '@'
            },
            restrict: "EA", 
            templateUrl: urlBase + '/App/directives/prov-portal-iframe/prov-portal-iframe.html' + cacheBust,
            controller: 'provPortalIframeController',
            controllerAs: 'ctrl',
            link: function (scope, el, attr) {

            }
        };
    });
    app.controller('provPortalIframeController', ['$scope', '$sce', 'memberDataService', function ($scope, $sce, memberDataService) {

        $scope.url = $sce.trustAsResourceUrl($scope.pageurl);
        $scope.title = $scope.pagetitle;
        $scope.intro = $scope.pageintro; 
 
        console.log('@PPIFRAMECONTROLLER');
    }]);
})();