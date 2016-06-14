(function () {
    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

    var app = angular.module('MemberPortalDirectives');

    app.directive("providerTile", function () {
        return {
            scope: {
                provider: '=',
                title: '@'
            },
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/directives/provider-tile/providerTile.html' + cacheBust
        };
    });
})();