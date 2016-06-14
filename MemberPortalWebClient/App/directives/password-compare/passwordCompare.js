(function () { 

    var app = angular.module('MemberPortalDirectives');

    app.directive("comparePasswordTo", function () {
        //console.log('@passCompare');
        return {
            require: ["ngModel", "^form"],
            scope: {
                otherModelValue: "=comparePasswordTo"
            },
            link: function (scope, element, attr, ctrl) {
                ctrl[0].$parsers.unshift(function (value) {
                    var fieldName = attr.comparePasswordTo;
                
                    if (ctrl[1][fieldName].$modelValue && ctrl[1][fieldName].$modelValue == value) {
                        // it is valid
                        ctrl[0].$setValidity('passwordMatch', true);
                        return value;
                    } else {

                        ctrl[0].$setValidity('passwordMatch', false);
                        return undefined;
                    }
                });

                scope.$watch("otherModelValue", function (newValue, oldValue) {
                    // ctrl.$validate();
                });
            }
        }; 

    });
    

    

})();
 

