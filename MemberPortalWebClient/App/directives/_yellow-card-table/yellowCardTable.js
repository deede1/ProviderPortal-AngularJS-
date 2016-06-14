(function () {
    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

    var app = angular.module('MemberPortalDirectives');

    app.directive("yellowCardTable", function () {
        return {
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/shared/immunization/yellowCardTable.html' + cacheBust,
            controller: 'yellowCardTableCtrl',
            controllerAs: 'ctrl'
        };
    });

    app.controller('yellowCardTableCtrl', ['$scope', function ($scope) {
        
        //Code Here...

    }]);

})();