(function () {
    angular.module('MemberPortalDirectives')
        .directive('zippyBox', function () {
            return {
                restrict: 'E',
                scope: {
                    name: '@',
                },
                transclude: true,
                template: [
                    '<div class="zippy-box" ng-class="{\'open\': !zipped, \'closed\' : zipped }">',
                        '<div ng-click="toggle()" class="zippy-box-header">{{name}}<span class="glyphicon" ng-class="{ \'glyphicon-menu-up\':!zipped, \'glyphicon-menu-down\': zipped }"></span></div>',
                        '<div class="zippy-box-content ngcloak" ng-show="!zipped">',
                            '<ng-transclude></ng-transclude>',
                        '</div>',   
                    '</div>'
                ].join(''),
                link: function (scope, element, attrs) {
                    scope.zipped = false;
                    scope.toggle = function () {
                        scope.zipped = !scope.zipped;
                    };
                }
            };
    });


    
})();