(function () {
    var app = angular.module('MemberPortalDirectives');

    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

    app.directive("securityQuestion", function () {
        return {

            restrict: "E",
            templateUrl: urlBase + '/App/directives/account/change-security-questions-form/security-question/security-question.html' + cacheBust,
            controller: 'securityQuestionsCtrl',
            controllerAs: 'ctrl'
        };
    });
    

    app.controller('securityQuestionsCtrl', ['$scope', 'authService', 'authStatusService', function ($scope, authService, authStatusService) {
        $scope.loading = false;
        $scope.errorMessage = "";
        $scope.infoMessage = "";
        $scope.successMessage = "";
        







    }]);
})();


