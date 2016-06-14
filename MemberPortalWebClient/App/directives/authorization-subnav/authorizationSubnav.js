(function () {
    var app = angular.module('MemberPortalDirectives');

    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

    app.directive("authorizationSubnav", function () {
        return {
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/directives/authorization-subnav/authorizationSubnav.html' + cacheBust,
            controller: 'authorizationSubnavCtrl',
            controllerAs: 'ctrl'
        };
    });
    app.controller('authorizationSubnavCtrl', ['$scope', '$location', 'memberDataService', '$translate',
        function ($scope, $location, memberDataService, $translate) {
        $scope.currentPath = $location.path().substring(1); //Removes the leading slash '/'

        $scope.subnavpages = [
            { path: "App/HealthRecords/Authorizations/All", name: 'page_healthrec_allAuthorizations_title'},
            { path: "App/HealthRecords/Authorizations/Medical", name: 'form_medical'},
            { path: "App/HealthRecords/Authorizations/Rx", name: 'form_pharmacy'},
            { path: "App/HealthRecords/Authorizations/Vision", name: 'form_vision'}
        ];
    }]);
})();


