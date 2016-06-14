(
    function () {
    var app = angular.module('MemberPortalDirectives');
    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');
    app.directive("rosterTableheaderSort", function () {
        return {
            scope: {
                viewLevel:'@',
                columnData: '@',
                columnLabel: '@',
                rowID:'@'
              
            },
            restrict: "EA",
          
            //replace: true,
            templateUrl: urlBase + '/App/directives/roster-tableheader-sort/RosterTableheaderSort.html' + cacheBust,
            controller: 'RosterTableHeaderSortController'
        };
    });


      
    //============= CONTROLLER
    app.controller('RosterTableHeaderSortController',
    [
        '$scope', '$rootScope', '$attrs', '$element',
        function ($scope, $rootScope, $attrs, $element) { 

            $scope.$on('updateTableHeader', function (event, sortObject) {
                $scope.sortDirection = sortObject.sortDirection;
                $scope.sortColumn = sortObject.sortColumn;
               
            });
             
        }]
        );


}

)();
