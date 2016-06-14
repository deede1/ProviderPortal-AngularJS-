(function () {
    
    angular.module('MemberPortalDirectives').directive('iehpExpressionBox', ['IehpRegexService', function (IehpRegexService) {
        function debounce(func, wait, immediate) {
            var timeout;
            return function () {
                var context = this, args = arguments;
                var later = function () {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        };

        return {
            scope: {
                model: '=',
                placeholder: '@',
                expressions: '='
            },
            template: [
                '<div class="input-group iehp-expression-box">',
                  '<input type="text" class="form-control" placeholder="{{placeholder}}" ng-model="model.input">',
                  '<span class="input-group-addon" ng-show="!model.multipleMatches && model.type">{{model.type}}</span>',
                  '<div class="input-group-btn" ng-show="model.multipleMatches">',
                    '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{model.type}} <span class="caret"></span></button>',
                    '<ul class="dropdown-menu dropdown-menu-right">',
                      '<li ng-repeat="match in model.matches" ng-click="setType(match)">{{match}}</li>',
                    '</ul>',
                  '</div>',
                '</div>'
            ].join(''),
            restrict: 'E',
            link: function (scope, element, attrs) {
                scope.model = scope.model || {};
                scope.model.multipleMatches = false;
                scope.model.matches = [];
                scope.model.type = null;
                scope.model.input = "";

                //scope.multipleMatches = false;
                //scope.matches = [];
                //scope.type = null;

                element.find('input').bind('blur', function () {
                    determineInputType();
                });
                element.bind('keyup', function () {
                    determineInputType();
                });

                scope.setType = function (str) {
                    scope.model.type = str;
                }

                var determineInputType = debounce(function () {

                    if (!scope.model.input) {
                        scope.model.type = null;
                        scope.model.multipleMatches = false;
                        scope.$apply();
                        return null;
                    }

                    var result = IehpRegexService.identify(scope.model.input, scope.expressions);
                    if (!result)
                        return null; //Reset

                    if (result.length == 1) {
                        scope.model.type = result[0];
                        scope.model.multipleMatches = false;
                    } else if (result.length > 1) {
                        scope.model.type = "Multiple Matches";
                        scope.model.multipleMatches = true;
                        scope.model.matches = result;
                    } else {
                        scope.model.type = null;
                        scope.model.multipleMatches = false;
                    }
                    scope.$apply();
                }, 150);


            }
        }
    }]);

})();