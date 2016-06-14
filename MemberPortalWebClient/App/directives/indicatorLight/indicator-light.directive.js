(function () {
    angular.module('MemberPortalDirectives').directive('indicatorLight', function () {
        return {
            scope: {
                config: '=ilConfig',
                src: '=ilSource',
                orange: '@ilOrange',
                red: '@ilRed',
                green: '@ilGreen',
                defaultHidden: '@'
            },
            template: '<span class="indicatorLight">&#x25cf;</span>',
            restrict: 'E',
            link: function (scope, element, attrs) {
                var red, orange, green, defaultHidden;


                //If config object is provided, it will override scope inputs (except source)
                if (scope.config) {
                    //use Config obj
                    red = scope.config.red || [];
                    orange = scope.config.orange || [];
                    green = scope.config.green || [];
                    defaultHidden = scope.config.defaultHidden || false;
                } else {
                    //Use red,green,orange,defaultHidden
                    red = scope.red || [];
                    orange = scope.orange || [];
                    green = scope.green || [];
                    defaultHidden = scope.defaultHidden || false;
                }


                if (red.indexOf(scope.src) > -1) {
                    element.css('color', 'red');
                } else if (orange.indexOf(scope.src) > -1) {
                    element.css('color', 'orange');
                } else if (green.indexOf(scope.src) > -1) {
                    element.css('color', 'green');
                } else if (defaultHidden) {
                    element.css('display', 'none');
                }
            }
        }
    });
})();