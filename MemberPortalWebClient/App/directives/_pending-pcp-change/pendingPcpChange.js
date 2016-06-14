(function () {
    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' +$('meta[name="templateCacheBust"]').attr('content');

    var app = angular.module('MemberPortalDirectives');

    app.directive("pendingPcpChange", function () {
        return {
            scope: {
            },
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/directives/pending-pcp-change/PendingPcpChangeRequest.html' + cacheBust,
            controller: 'pendingPcpChangeCtrl',
            controllerAs: 'ctrl'
        };
    });
    app.controller('pendingPcpChangeCtrl', ['$scope', 'memberDataService', function ($scope, memberDataService) {
        $scope.loading = false;
        $scope.data = {};
        $scope.dataString = {};
        $scope.ErrorMsg = "";
        $scope.showDetails = false;


        //Events
        $scope.$on('pcp-selected', function (event, provider, contract) {
            $scope.getPendingPcpChanges();
        });

        $scope.getPendingPcpChanges = function () {
            //alert($scope.SubscriberNumber);
            $scope.loading = true;
            memberDataService.getPendingPcpChanges().success(function (data) {
                //success
                $scope.data = data;
                $scope.loading = false;
            }).error(function () {
                //error
                $scope.ErrorMsg = "Aw Snap!";
                $scope.loading = false;
            });
        };

        $scope.cancelRequest = function (id) {
            memberDataService.deleteRequest(id).success(function(data) {
                $scope.getPendingPcpChanges();
            }).error(function() {
                $scope.ErrorMsg = "There was a problem canceling your pcp change request.";
                //alert('boo');
            });
        };

        $scope.getPendingPcpChanges();

    }]);
})();