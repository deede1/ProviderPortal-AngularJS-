(function () {
    var app = angular.module('MemberPortalDirectives');
    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

    app.directive("providerSearchSlider", function () {
        return {
            scope: {
                miles: '='
            },
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/directives/provider-search-slider/providerSearchSlider.html' + cacheBust,
            controller: 'providerSearchSliderCtrl',
            controllerAs: 'ctrl',
            link: function(scope, element, attrs) {
                



                //scope.updateMiles = function () {
                //    scope.miles = $('#distanceSlider').val();
                //};

                //$('#distanceSlider').noUiSlider({
                //    range: [1, 20]
                //   , start: 5
                //   , handles: 1
                //   , step: 1
                //   , connect: "lower"
                //   , slide: function () {
                //        scope.updateMiles();
                //        scope.$apply();
                //    }
                //});

                //scope.updateMiles();
            }
        };
    });

    app.controller("providerSearchSliderCtrl", ['$scope', function ($scope) {
        $scope.miles = 5;
        $scope.options = {
            from: 1,
            to: 20,
            step: 1,
            dimension: " mi",
            css: {
                'background': { "background-color": "white" },
                'before': { "background-color": "white" },
                'default': { "background-color": "white" },
                'after': { "background-color": "white" },
                'pointer': {  },
                'range' : {"background-color": "white"} // use it if double value
            }
        };
    }]);
})();


