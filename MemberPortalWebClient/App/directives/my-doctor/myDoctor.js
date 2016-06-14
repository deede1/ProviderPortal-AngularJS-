(function () {
    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

    var app = angular.module('MemberPortalDirectives');

    app.directive("myDoctor", function () {
        return {
            scope: {
                elig: '=',
                testUserMode: '='
            },
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/directives/my-doctor/myDoctor.html' + cacheBust,
            controller: 'myDoctorCtrl',
            controllerAs: 'ctrl',
            link: function (scope, el, attr) {

            }
        };
    });
    app.controller('myDoctorCtrl', ['$scope', 'memberDataService', function ($scope, memberDataService) {

    }]);
})();