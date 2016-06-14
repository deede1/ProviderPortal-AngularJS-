(function () {
    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

    var app = angular.module('MemberPortalDirectives');

    app.directive("eligibilityHistoryTable", function () {
        return {
            scope: {
                eligArray: '='
            },
            restrict: "EA",
            templateUrl: urlBase + '/App/directives/eligibility-history-table-expandable/eligibilityHistoryTableExpandable.html' + cacheBust,
            controller: 'eligibilityHistoryTableCtrl',
            controllerAs: 'ctrl'
        };
    });
    app.controller('eligibilityHistoryTableCtrl', ['$scope', '$filter', 'authStatusService',
        function ($scope, $filter, authStatusService) {
        $scope.showMore = false;
        $scope.showMoreAction = 'More';
        $scope.predicate = '';
        $scope.ageGroup = authStatusService.status.claims.agegroup; 
        $scope.reverse = false;
        var orderBy = $filter('orderBy');
        $scope.order = function (predicate, reverse) {
            if ($scope.predicate != predicate) {
                $scope.reverse = !$scope.reverse;
            }
            $scope.eligArray = orderBy($scope.eligArray, predicate, reverse);
            $scope.LobDescription = eligArray.LobDescription;
        };

        $scope.toggleShowMore = function () {
            $scope.showMore = !$scope.showMore;
            $scope.showMoreAction = ($scope.showMore) ? 'Less' : 'More';
        };
    }]);
})();