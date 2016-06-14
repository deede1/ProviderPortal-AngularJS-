(function() {
    var app = angular.module('MemberPortalDirectives');

    app.directive("simpleAjaxLoader", function () {
        return {
            scope: {
                show: '=',
                height: '='
            },
            restrict: 'EA',
            //replace: true,
            template: '<div   ng-class="{}" ng-show="show"><div class="loader" ng-class="{\'loading\':show}"></div>'
          
        };
    });

 

})();