(function () {

    angular.module('MemberPortalServices').factory('AuthorizationStatusService', AuthorizationStatusService);

    AuthorizationStatusService.$inject = ['$http', '$rootScope'];

    function AuthorizationStatusService($http, $rootScope) {

        var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
        //if you want to use alpha branch to test an endpoint, use 'var serviceBase=alphaBase;' ONLY in your method -LD
        var alphaBase = 'http://devserv.iehp.org/IehpWebApiAlpha/';
        var devBase = 'https://devserv.iehp.org/IehpWebApiDev/';

        //var serviceBase = devBase;
        var serviceBase = $('meta[name="dataServiceBase"]').attr('content');

        var Search = function (params) {

            /*
                {
                    "beginDate": "2016-03-02T11:15:11.1167513-08:00",
                    "endDate": "2016-03-02T11:15:11.1177514-08:00",
                    "anyProviderId": "sample string 1",
                    "anyProviderTaxId": "sample string 2",
                    "requestingProviderId": "sample string 3",
                    "requestingProviderTaxId": "sample string 4",
                    "servicingProviderId": "sample string 5",
                    "servicingProviderTaxId": "sample string 6",
                    "facilityProviderId": "sample string 7",
                    "facilityProviderTaxId": "sample string 8",
                    "memberPcpId": "sample string 9",
                    "memberPcpTaxId": "sample string 10",
                    "category": "sample string 11",
                    "status": "sample string 12",
                    "statusReason": "sample string 13",
                    "authorizationNumber": "sample string 14",
                    "authRequestType": "sample string 15",
                    "subscriberNumber": 1,
                    "priority": "sample string 16",
                    "inpatientOnly": true
                }  
                */

            
            return $http.post(serviceBase + 'Provider/Portal/Authorizations/Search', params);
        };

        return {
            Search: Search
        };
    }
})();