(function () {
    var app = angular.module('MemberPortalDirectives');

    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');
 

    app.directive("pendMaterialRequest", function () {

 
        return {
            scope: {}, //isolated scope
            restrict: "EA",
            //replace: true, //replace directive with template
            templateUrl: urlBase + '/App/directives/materialRequest/pendingMaterialRequest.html' + cacheBust,
            controller: 'pendingMatReqCtrl',
            controllerAs: 'ctrl'
        };
    });
    app.controller('pendingMatReqCtrl', ['$scope', '$rootScope','memberDataService', function ($scope,$rootScope, memberDataService) {
        $scope.loading = false;
        $scope.data = {};
        $scope.dataString = {};
        $scope.ErrorMsg = "";
        $scope.showDetails = false; 
 
        $scope.$on('fetchPendingMaterialRequests', function () {
            $scope.getPendingMaterialRequests();
        });
        $scope.getPendingMaterialRequests = function () {
            //alert($scope.SubscriberNumber);
            $scope.loading = true; 
            memberDataService.getPendingMaterialRequests().success(function (data) { 
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
            var params = [];
            var item = { 'RequestId' : id };
            params.push(item);
            memberDataService.cancelMaterialRequest(id).success(function (data) {
                $scope.getPendingMaterialRequests();
                $rootScope.$broadcast("fetchAvailableMaterialRequests");
            }).error(function () {
                $scope.ErrorMsg = "Aw! There was a problem canceling your request. Please try again later.";
                //alert('boo');
                alert($scope.ErrorMsg);
            });
        };

 

        $scope.getPendingMaterialRequests();

    }]);
})();