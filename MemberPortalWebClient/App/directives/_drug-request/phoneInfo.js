(function () {
    var app = angular.module('MemberPortalDirectives');

    // JavaScript source code
    app.directive('phoneInfo', function () {
        var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
        var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');
        return {
            require: '^form',
            restrict: 'E',
            transclude: true,
            scope: {
                setRequired: '@?',
                myStyle: '@?',
                number: '='
            },
            templateUrl: urlBase + '/App/directives/drug-request/phoneInfo.html' + cacheBust,
            link: function (scope, elem, attrs, ctrl) {
                scope.phoneNumber = {
                    prefix: '',
                    areaCode: '',
                    lineNumber: ''
                }
                scope.invalidNumber = false;
                scope.successful = false;
                scope.form = ctrl;
                //Raise a flag for any input that isn't a number
                function buildNumber(number) {
                    scope.number = number.areaCode + number.prefix + number.lineNumber;
                    if (/^[0-9]{0,10}$/.test(scope.number)) {
                        scope.invalidNumber = false;
                    } else {
                        scope.invalidNumber = true;
                    }
                }
                //Block any input that isn't a number
                //Check for common invalid numbers like 555 or 123 numbers.
                function numberOnly(number, event) {
                    scope.number = number.areaCode + number.prefix + number.lineNumber;
                    if (/^[0-9]{0,10}$/.test(scope.number)) {
                        //scope.invalidNumber = false;
                    } else {
                        event.preventDefault();
                    }
                }
                //elem.bind("keydown keypress", buildNumber);
                scope.$watchCollection('phoneNumber', buildNumber);
                scope.$parent.$watch('successfulSubmit', function (value) {
                    if (value === true) {
                        scope.successful = true;
                    }
                });
            }
        };
    });
})();