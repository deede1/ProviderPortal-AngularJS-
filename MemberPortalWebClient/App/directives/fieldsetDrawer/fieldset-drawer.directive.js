(function () {


    angular.module('MemberPortalDirectives').directive('fieldsetDrawer', function () {
        return {
            scope: {
                legend: '@',
                openedLegend: '@',
                closedLegend: '@'
            },
            template: '<fieldset class="fieldsetDrawer"><legend>{{legend}}</legend><div class="drawer-content" ng-transclude></div></fieldset>',
            transclude: true,
            restrict: 'E',
            link: function (scope, element, attrs) {
                var legend = element.find('legend');
                var fieldset = element.find('fieldset');


                legend.bind('click', function () {
                    //Toggle Opened Class
                    fieldset.toggleClass('open');
                    //Update Legend
                    setLegend();
                    scope.$apply();
                });


                var setLegend = function () {
                    if (fieldset.hasClass('open')) {
                        scope.legend = scope.openedLegend || scope.legend;
                    } else {
                        scope.legend = scope.closedLegend || scope.legend;
                    }
                };

                //Sets the initial legend;
                setLegend();
            }
        }

    });

})();