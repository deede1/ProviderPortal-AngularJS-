(function () {

    angular.module('MemberPortalDirectives')
        .directive('eligibilitySearch', ['memberDataService', 'IehpRegexService', function (memberDataService, IehpRegexService) {
        return {
            restrict: 'E',
            template: [
                '<div class="eligibility-search-container cf">',
                    '<zippy-box name="Eligibility Search">',
                        '<form ng-submit="vm.search()">',
                            '<ul class="list-unstyled cf">',
                                '<li ng-repeat="item in vm.params">',
                                    '<eligibility-search-param></eligibility-search-param>',
                                '</li>',
                                '<li>',
                                    '<div class="eligibility-search-box noselect">',
                                        '<button class="search-box-add-button " ng-click="add(item)">',
                                            '<span class="glyphicon glyphicon-plus"></span>',
                                        '</button>',
                                        '<div class="input-group iehp-expression-box">',
                                          '<input type="text" class="form-control" placeholder="SSN, CIN, IEHP ID, or Last Name" tabindex="-1">',
                                        '</div>',
                                        '<div class="eligibility-search-box-extras cf">',
                                            '<div class="input-group">',
                                                '<span class="input-group-addon">DOS</span>',
                                                '<input class="form-control" mask="39/19/9999"  type="text" date-input placeholder="mm/dd/yyyy"  tabindex="-1"/>',
                                            '</div>',
                                            '<div class="input-group" ng-show="item.searchTerm.type == lastName">',
                                                '<span class="input-group-addon">DOB</span>',
                                                '<input class="form-control" type="text" mask="39/19/9999" placeholder="mm/dd/yyyy" tabindex="-1"/>',
                                            '</div>',
                                        '</div>',
                                    '</div>',
                                '</li>',
                            '</ul>',
                        '<button type="submit">Search</button>',
                        '</form>',  
                    '</zippy-box>',
                    '<eligibility-search-result></eligibility-search-result>',
                '</div>'
            ].join(''),
            link: function (scope, element, attrs) {
                scope.lastName = 'Last Name';
                //scope.data.results = [];
                scope.resultsString = ''; //For Development Only; Remove Later;

                //Initialize Search Term Expressions
                scope.searchTermExpressions = IehpRegexService.getExpressionConfig([
                    { name: 'Cin', override: 'CIN' },
                    { name: 'SubscriberNumber', override: 'IEHP ID' },
                    { name: 'Social', override: 'SSN' },
                    { name: scope.lastName, expression: /^[a-zA-Z]{3,}$/ }
                ]);
                
                //Add Function
                scope.add = function(obj) {
                    scope.vm.params.push({});
                };
            },
            controller: ['memberDataService', function (memberDataService) {
                var vm = this;
                vm.data = {};
                vm.data.results = [];
                vm.params = [{}];

                

                vm.search = function () {
                    memberDataService.GetEligibility(prepareRequestParams()).then(function (data) {
                        vm.data.results = data.data.Result;
                        vm.data.VerificationId = data.data.VerificationId;
                        vm.data.timestamp = new Date();
                        vm.resultsString = JSON.stringify(vm.data.results, null, '  ');
                    }, function () {
                        alert('boo');
                    });
                };


                var prepareRequestParams = function () {
                    //scope.params

                    var output = [];

                    for (i = 0; i < vm.params.length; i++) {
                        var item = vm.params[i];

                        var obj = { Value: item.searchTerm.input, Type: item.searchTerm.type, DateOfBirth: item.dob, DateOfservice: item.dos };

                        //Fix Type For Service
                        obj.Type = (obj.Type == 'IEHP ID') ? 'IehpId'
                            : (obj.Type == 'CIN') ? 'Cin'
                            : (obj.Type == 'SSN') ? 'Ssn'
                            : (obj.Type == 'Last Name') ? 'LastNameAndDateOfBirth'
                            : obj.Type;
                        output.push(obj);
                    }
                    return output;
                };

                
                vm.remove = function (obj) {
                    var i = vm.params.indexOf(obj);
                    if (vm.params.length > 1 && i > -1) //Prevents the last remaining item, and an item missing a model (the 'add new' instance) from being removed.
                        vm.params.splice(i, 1);
                };

            }],
            controllerAs: 'vm'
        };
    }]);

    angular.module('MemberPortalDirectives')
        .directive('eligibilitySearchParam', function () {
            return {
                restrict: 'E',
                scope: true,
                template: [
                    '<div class="eligibility-search-box ">',
                        '<button ng-class="{\'search-box-close-button\':!disabled, \'search-box-add-button\' : disabled}" ng-click="action(item)">',
                            '<span class="glyphicon" ng-class="{\'glyphicon-remove\' : !disabled, \'glyphicon-add\': disabled}"></span>',
                        '</button>',
                        '<iehp-expression-box model="item.searchTerm" placeholder="SSN, CIN, IEHP ID, or Last Name" expressions="searchTermExpressions"></iehp-expression-box>',
                        '<div class="eligibility-search-box-extras cf">',
                            '<div class="input-group">',
                                '<span class="input-group-addon">DOS</span>',
                                '<input class="form-control" mask="39/19/9999"  type="text" date-input placeholder="mm/dd/yyyy" ng-model="item.dos" ng-required="true" />',
                            '</div>',
                            '<div class="input-group" ng-show="item.searchTerm.type == lastName">',
                                '<span class="input-group-addon">DOB</span>',
                                '<input class="form-control" type="text" mask="39/19/9999" placeholder="mm/dd/yyyy" ng-model="item.dob" ng-required="item.searchTerm.type == lastName"/>',
                            '</div>',
                        '</div>',
                    '</div>',
                ].join(''),
                link: function (scope, element, attrs) {
                    //scope.hasModel = !!(attrs.disabled);
                    scope.disabled = !!scope.disabled;


                    if (!scope.disabled)
                        element.find('iehp-expression-box').find('input').focus();
                    else {
                        scope.disabled = true;
                    }
                    scope.action = (scope.disabled) ? scope.add : scope.vm.remove;
                }
            }

        });


    var urlBase = $('meta[name="ApplicationRoot"]').attr('content'),
        cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

    //use this helper function to minimize repeated code in the routes
    function url(url) {
        return urlBase + url + cacheBust;
    }

    angular.module('MemberPortalDirectives')
        .directive('eligibilitySearchResult', function () {
            return {
                scope: true,
                restrict: 'EA',
                require: '^eligibilitySearch',
                templateUrl: url('/App/components/eligibility/eligibility-search-result.directive.html'),
                link: function (scope, element, attrs, eligSearch) {
                    //Bind the data node to the AuthStatus.data node.
                    scope.data = eligSearch.data;
                }
            };
        });
})();