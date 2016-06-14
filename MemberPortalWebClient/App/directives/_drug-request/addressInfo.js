(function () {
    var app = angular.module('MemberPortalDirectives');

    // JavaScript source code
    app.directive('addressInfo', function () {

        var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
        var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');
        return {
            require: '^form',
            restrict: 'E',
            scope: {
                data: '=?'
            },
            templateUrl: urlBase + '/App/directives/drug-request/addressInfo.html' + cacheBust,
            link: function (scope, element, attrs, formCtrl) {
                scope.form = formCtrl;
            },
            controller: ['$scope',function ($scope) {
                $scope.emptyField = function (form, input) {
                    if (!input && form.$submitted) {
                        return true;
                    }
                    return false;
                };
            }]
        };
    });

    /* Directive that checks if a value is characters only.
     * If the value contains a special character or number
     * it attaches ng-invalid-char-only.
     * otherwise attach ng-valid-char-only
     */
    app.directive('charOnly', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attrs, ctrl) {
                scope.$watch(attrs.ngModel, function (v) {
                    if (/[0-9`~!@#$%^&*()_=+{|}:;"',.<>?/\-\\]+/.test(v)) {
                        ctrl.$setValidity('charOnly', false);
                    }
                    else {
                        ctrl.$setValidity('charOnly', true);
                    }
                });
            }
        };
    });

    /* Directive that checks if a value is number only.
     * If the value contains a special character or character
     * it attaches ng-invalid-num-only.
     * otherwise attach ng-valid-num-only
     */
    app.directive('numOnly', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                scope.$watch(attrs.ngModel, function (v) {
                    if (!ctrl.$isEmpty(v) && /[A-Za-z`~!@#$%^&*()_=+{|}:;"',.<>?/\-\\]+/.test(v)) {
                        ctrl.$setValidity('numOnly', false);
                    }
                    else {
                        ctrl.$setValidity('numOnly', true);
                    }
                });
            }
        };
    });



    app.directive('dateOnly', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                scope.$watch(attrs.ngModel, function (v) {
                    if (!ctrl.$isEmpty(v) && /[A-Za-z`~!@#$%^&*()_=+{|}:;"',.<>?\-\\]+/.test(v)) {
                        ctrl.$setValidity('dateOnly', false);
                        console.log('valid, if, false');
                    }
                        // REGEX takes in anything with an optional number atm.
                    else if (/[0-9]+/) {
                        ctrl.$setValidity('dateOnly', true);
                        console.log('valid, esle if, true');
                    }
                    else {
                        ctrl.$setValidity('dateOnly', false);
                        console.log('valid, else, false');
                    }
                });
            }
        };
    });
})();