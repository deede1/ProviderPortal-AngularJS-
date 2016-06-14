(function () {
    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

    angular.module('MemberPortalDirectives')
        .directive('searchBox', function () {
                return {
                    restrict: 'E',
                    scope: {
                        placeholder: '@',
                        inputname: '@',
                        checkInputType: '&method1',
                        clearInput:'&method2'

                },
                templateUrl: urlBase + '/App/directives/searchBox/searchBox.html' + cacheBust,
                link:function(scope, elem, attr) {
                   
                    //var el = elem.find("input[name='memberIdInput']");
                    //el.bind("keydown", function(event) {
                    //    if (event.which == 13)
                    //        alert("Entered!");
                    //});
                },
                controller: function ($scope) {
                    $scope.checkType = function (IdQuery) {
                        $scope.checkInputType({ IdQuery: IdQuery });
                    };
                    $scope.showClear = false;
                    $scope.type = null;
                    $scope.setShowClear = function (val) {
                        $scope.showClear = val;
                    };
                    $scope.Clear = function () {
                        $scope.clearInput();
                        
                    };
                    $scope.$on('type', function (event, args) {
                        $scope.type = args.val.string;
                        
                    });
                }
            };
        });



})();