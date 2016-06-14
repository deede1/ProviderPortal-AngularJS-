angular.module('MemberPortalDirectives')
.directive('removeSpecialCharacters', function ($parse) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, iElement, iAttrs) {
            scope.$watch(iAttrs.ngModel, function (value) {
                if (!value) {
                    return;
                }
                $parse(iAttrs.ngModel).assign(scope, value.replace(/[^ a-zA-Z0-9()?\.\-,:;@/=$%&!'>"#+<\s\r\n]+/g, ""));
            });
        }
    }
});