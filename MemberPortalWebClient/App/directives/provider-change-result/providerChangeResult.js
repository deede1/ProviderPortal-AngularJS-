(function () {
    var app = angular.module('MemberPortalDirectives');

    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

    app.directive("providerChangeResult", function () {
        return {
            scope: {
                provider: '=',
                member: '='
            },
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/directives/provider-change-result/providerChangeResult.html' + cacheBust,
            controller: 'providerChangeResultCtrl',
            controllerAs: 'ctrl'
        };
    });


    app.controller('providerChangeResultCtrl', ['$scope', 'memberDataService','$rootScope', function ($scope, memberDataService, $rootScope) {
        $scope.loading = false;
        $scope.data = {};
        $scope.dataString = {};
        $scope.showLocation = false;
        $scope.errorMessage = '';

        $scope.selectPcp = function (provider, contract) {

            var param = {
                NewProviderNumber: provider.ProvId,
                NewProviderPanel: contract.Panel,
                SelectedTermReason: '1MOTH' 
            };

            memberDataService.SubmitPcpChange(param).success(function () {
                $rootScope.$broadcast('pcp-selected', provider, contract);
            }).error(function (msg) {
                $scope.errorMessage = msg; //"Aw Snap! There was a problem canceling your pcp change request.";
            });
        };

        $scope.isCompatible = function(providerIpaCode, memberIpaCode) {

            var memberIsDirect = memberIpaCode.toLowerCase().indexOf('j') != -1;
            var providerIsDirect = providerIpaCode.toLowerCase().indexOf('j') != -1;

            if (memberIsDirect && providerIsDirect)
                return true;
            else 
                return providerIpaCode == memberIpaCode;
        };
    }]);


})();


