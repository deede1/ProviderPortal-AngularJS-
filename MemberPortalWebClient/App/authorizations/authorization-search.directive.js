(function () {
    var app = angular.module('MemberPortalDirectives');


    var urlBase = $('meta[name="ApplicationRoot"]').attr('content'),
           cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

    //use this helper function to minimize repeated code in the routes
    function url(url) {
        return urlBase + url + cacheBust;
    }


    app.directive('authorizationSearch', function () {
        return {
            scope: true,
            restrict: 'EA',
            templateUrl: url('/app/authorizations/authorization-search.directive.html'),
            controller: 'AuthorizationSearchController',
            controllerAs: 'vm',
            link: function (scope, element, attrs) {
                scope.vm.search();
            }
        };
    });

    AuthorizationSearchController.$inject = ['AuthorizationStatusService', 'IehpRegexService'];
    function AuthorizationSearchController(AuthorizationStatusService, IehpRegexService) {
        var vm = this;

        //Initializations
        vm.searchTermExpressions =[];
        vm.showAdvanced = false;
        vm.results = {}; //Binds to result directive, add/remove properties, do not replace with new instance.
        vm.param = {};
        
        vm.today = moment().format('MM/DD/YYYY');
        vm.param.fromDate = moment().subtract(5, 'days').format('MM/DD/YYYY');
        vm.param.toDate = moment().format('MM/DD/YYYY');

        vm.toggleAdvanced = function () {
            vm.showAdvanced = !vm.showAdvanced;
            //Do stuff            
        };


        vm.indicatorConfig = {
            orange: ['In Progress'],
            red: ['Dismissed', 'Denied Admin', 'Denied', 'Canceled'],
            green: ['Complete', 'Approved', 'Approved- Rx'],
            defaultHidden: false
        };



        vm.authorizationTypes = ["Medical", "Rx", "Vision", "Behavioral"];
        vm.types = ["Medical", "Rx", "Vision"];


        //Configure Expressions For Expression Box
        vm.searchTermExpressions = IehpRegexService.getExpressionConfig([
            { name: 'Cin', override: 'CIN' },
            { name: 'SubscriberNumber', override: 'IEHPID' },
            { name: 'Social', override: 'SSN' },
            { name: 'RxAuthId', override: 'Rx Auth' },
            { name: 'MedicalAuthId', override: 'Medical Auth' },
            { name: 'VisionAuthId', override: 'Vision Auth' },
            { name: 'ProviderId', override: 'Provider' }
        ]);

        //Search Method
        vm.search = function () {

            //Generate search parameter object
            var param = generateSearchParam();

            //Call Search Method
            AuthorizationStatusService.Search(param).then(function (response) {
                vm.results.authorizations = response.data;
            });

        };

        var generateSearchParam = function () {
            var searchParam = {
                "beginDate": vm.param.fromDate,
                "endDate": vm.param.toDate,
                "anyProviderId": vm.param.anyProviderId,
                //"anyProviderTaxId": "sample string 2",
                "requestingProviderId": vm.param.requestingProviderId,
                //"requestingProviderTaxId": "sample string 4",
                "servicingProviderId": vm.param.servicingProviderId,
                //"servicingProviderTaxId": "sample string 6",
                "facilityProviderId": vm.param.facilityProviderId,
                //"facilityProviderTaxId": "sample string 8",
                "memberPcpId": vm.param.memberPcpId,
                //"memberPcpTaxId": "sample string 10",
                "category": vm.param.category,
                "status": vm.param.status,
                "statusReason": vm.param.statusReason,
                "authorizationNumber": vm.param.authorizationNumber,
                "authRequestType": vm.param.authRequestType,
                "AuthTypes": vm.types,
                "subscriberNumber": vm.param.subscriberNumber,
                "priority": vm.param.priority,
                "inpatientOnly": vm.param.inpatientOnly
            };

            //Apply Search Term

            if (vm.searchTerm && vm.searchTerm.type) {
                switch (vm.searchTerm.type) {
                    case 'IEHPID':
                        searchParam.subscriberNumber = vm.searchTerm.input;
                        break;
                    case 'Medical Auth':
                        searchParam.authorizationNumber = vm.searchTerm.input;
                        break;
                    case 'Vision Auth':
                        searchParam.authorizationNumber = vm.searchTerm.input;
                        break;
                    case 'Rx Auth':
                        searchParam.authorizationNumber = vm.searchTerm.input;
                        break;
                    case 'CIN':
                        searchParam.MemberCin = vm.searchTerm.input;
                        break;
                    case 'SSN':
                        searchParam.MemberSsn = vm.searchTerm.input;
                        break;
                    case 'Multiple Matches':
                        //Do stuff

                        break;
                }
            }

            return searchParam;
        };
    }
    app.controller('AuthorizationSearchController', AuthorizationSearchController);
})();