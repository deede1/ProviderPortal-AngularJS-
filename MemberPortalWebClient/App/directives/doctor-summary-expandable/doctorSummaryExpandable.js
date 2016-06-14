(function () {
    var app = angular.module('MemberPortalDirectives');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

    app.directive("doctorSummaryExpandable", function () {
        return {
            scope: {
                eligRecord: '='
            },
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/directives/doctor-summary-expandable/doctorSummaryExpandable.html' + cacheBust,
            controller: 'doctorSummaryExpandableCtrl',
            controllerAs: 'ctrl'
        };
    });
    app.controller('doctorSummaryExpandableCtrl', ['$scope', function ($scope) {
        $scope.showMore = false;
        $scope.showMoreAction = 'More';

        $scope.toggleShowMore = function () {
            $scope.showMore = !$scope.showMore;
            $scope.showMoreAction = ($scope.showMore) ? 'Less' : 'More';
        };
    }]);
})();