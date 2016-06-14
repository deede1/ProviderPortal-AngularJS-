(function () {
    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

    var app = angular.module('MemberPortalDirectives');

    app.directive("expandableEligibilitySummary", function () {
        return {
            scope: {
                eligRecord: '='
            },
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/directives/eligibility-summary-expandable/eligibilitySummaryExpandable.html' + cacheBust,
            controller: 'eligibilitySummaryExpandableCtrl',
            controllerAs: 'ctrl'
        };
    });

    app.controller('eligibilitySummaryExpandableCtrl', ['$scope', function ($scope) {
        $scope.showMore = false;
        $scope.showMoreAction = 'More';

        $scope.toggleShowMore = function () {
            $scope.showMore = !$scope.showMore;
            $scope.showMoreAction = ($scope.showMore) ? 'Less' : 'More';
        };
    }]);
})();