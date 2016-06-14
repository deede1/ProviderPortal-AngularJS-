(function() {
    var app = angular.module('MemberPortalDirectives');

    app.directive("simpleErrorBox", function () {
        return {
            scope: {
                msg: '@message'
            },
            restrict: "EA",
            //replace: true,
            template: '<div class="alert alert-danger" role="alert" ng-show="msg != \'\'"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error: </span>{{msg}}</div>'
        };
    });
})();