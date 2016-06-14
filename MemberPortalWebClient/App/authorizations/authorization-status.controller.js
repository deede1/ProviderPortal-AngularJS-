(function () {
    var app = angular.module('MemberPortal');

    /* Authorizations */

    app.controller('AuthorizationStatusController', ['$scope', 'memberDataService',
        function ($scope, memberDataService) {
            $scope.loading = false;
            $scope.searchResults = {};
            $scope.searchResultsString = {};

            var param = {
                "beginDate": "2013-03-02T11:15:11.1167513-08:00",
                "endDate": "2016-03-02T11:15:11.1177514-08:00",
                //"anyProviderId": "sample string 1",
                //"anyProviderTaxId": "sample string 2",
                //"requestingProviderId": "sample string 3",
                //"requestingProviderTaxId": "sample string 4",
                //"servicingProviderId": "sample string 5",
                //"servicingProviderTaxId": "sample string 6",
                //"facilityProviderId": "sample string 7",
                //"facilityProviderTaxId": "sample string 8",
                //"memberPcpId": "sample string 9",
                //"memberPcpTaxId": "sample string 10",
                //"category": "sample string 11",
                //"status": "sample string 12",
                //"statusReason": "sample string 13",
                //"authorizationNumber": "sample string 14",
                //"authRequestType": "sample string 15",
                "subscriberNumber": 199701018576,
                //"priority": "sample string 16",
                "inpatientOnly": false
            };

            //memberDataService.SearchAuthorizations(param).then(function (response) {
            //    $scope.searchResults = response.data;
            //    $scope.searchResultsString = JSON.stringify(response.data, null, '  ');
            //});
        }]);

})();