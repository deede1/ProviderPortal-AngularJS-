 (function () { 

        var app = angular.module('MemberPortalDirectives'); 
        var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
        app.directive("resultsPagination", function () {
        return {
            scope: {
                elig: '=',
                testUserMode: '=' 
            },
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/directives/pagination/pagination.html',
            controller: 'paginationController'

         
        };
    });

        app.controller('paginationController',
            ['$scope', '$rootScope', '$compile',
            function ($scope, $rootScope, $compile) {

        $scope.nextPageIndex = 0;
        $scope.prevPageIndex = 0;
        $scope.pages = [];
        $scope.totalPageCount = 0;
        $scope.visiblePageOptions = 0;
        $scope.currentPageIndex = 0;
        $scope.sortBy = 0;
        $scope.rosterType = "";
        $scope.startPageIndex = 0;
        $scope.TotalListCount = 0;
        $scope.displayPagination = false;
        $scope.RowsPerPage = 0;
                 


                //console.log('@============> PAGINATION DIRECTIVE');
        //====== PAGINATION : FETCH NEW SET
//        $scope.nextPageSet = function (rosterType, startPageIndex, sortBy, totalPageCount, visiblePageOptions, currentPageIndex) {
        $scope.nextPageSet = function (startPageIndex) {
            //console.log('@NEXT PAGESET ============= ROSTER TYPE:' + $scope.paramObject.rosterType + ' SORT BY: ' + $scope.paramObject.sortBy);
            $scope.totalPageCount = $scope.paramObject.totalPageCount; 
           // $scope.visiblePageOptions = $scope.paramObject.visiblePageOptions;
            $scope.currentPageIndex = $scope.paramObject.currentPageIndex;
            $scope.sortBy = $scope.paramObject.sortBy;
            $scope.rosterType = $scope.paramObject.rosterType;
            $scope.startPageIndex = startPageIndex;// $scope.paramObject.startPageIndex;

            $scope.showNextPagingButton = false;
            $scope.showPrevPagingButton = false; 
            $scope.pageNumber = $scope.startPageIndex; 
            $scope.pages = [];

          

            if ($scope.paramObject.totalPageCount >= $scope.pageNumber + $scope.paramObject.visiblePageOptions) {
                   //console.log('TOTAL > VISIBLE ');
               //console.log('TOTAL > VISIBLE ');
                    for (var i = 0; i <= $scope.paramObject.visiblePageOptions - 1; i++) {
                        //console.log('i=' + i + ' -> ' + $scope.pageNumber);
                        $scope.pages[i] = $scope.pageNumber;
                        $scope.pageNumber++;
                        }
                   $scope.showNextPagingButton = true;
            } else {
              //console.log('TOTAL !> VISIBLE; DONT SHOW NEXT PAGE');
                for (var i = 0; i <= $scope.paramObject.totalPageCount - startPageIndex; i++) {
                            //console.log('i=' + i + ' -> ' + (i + 1));
                            $scope.pages[i] = $scope.pageNumber;
                            $scope.pageNumber++;
                        }
                   $scope.showNextPagingButton = false;
            }

            $scope.nextPageIndex = $scope.startPageIndex + $scope.paramObject.visiblePageOptions;
            $scope.startListRowIndex = ($scope.currentPageIndex - 1) * 25 + 1;
            $scope.endListRowIndex = $scope.currentPageIndex * 25;

            //===== Hide Previous Button only when displaying first set
            $scope.showPrevPagingButton = true;

            if ($scope.startPageIndex === 1)
                $scope.showPrevPagingButton = false;

            $scope.prevPageIndex = $scope.nextPageIndex - $scope.paramObject.visiblePageOptions * 2;

            //console.log($scope.paramObject.totalListCount + '  >>>> ' + $scope.paramObject.rowsPerPage);

            $scope.TotalListCount = $scope.paramObject.TotalListCount;

            if ($scope.paramObject.totalListCount > $scope.paramObject.rowsPerPage) {
                $scope.displayPagination = true;
               //console.log(' DISPLAY PAGINATION OK!');
            } else {
               //console.log('DO NOT DISPLAY PAGINATION ');
                $scope.displayPagination = false;
            }

            $scope.displayPagination = true;

           //console.log('NEXTPAGEINDEX=' + $scope.nextPageIndex);
           //console.log('PREVPAGEINDEX=' + $scope.prevPageIndex); 
        };
        //======= VIEW PAGE
        $scope.viewPage = function (pageIndex) {
            //console.log('clicked VIEWPAGE TO PAGEINDEX :' + pageIndex + ',  SORTBY:'+ $scope.sortBy  + ' TYPE:' + $scope.rosterType );
           // $scope.$parent.viewPage($scope.rosterType, pageIndex, $scope.sortBy);
            $scope.$parent.$parent.viewPage($scope.rosterType,  pageIndex, $scope.sortBy); 
            $scope.currentPageIndex = pageIndex;
            $scope.startListRowIndex = ($scope.currentPageIndex - 1) * 25 + 1;
            $scope.endListRowIndex = $scope.currentPageIndex * 25;
        };

        //====== UPDATE PAGINATION NAV
        $scope.updatePagination = function (startPageIndex) {
            //console.log('clicked UPDATED PAGINATION TO :' + startPageIndex);
           // $scope.$parent.viewPage($scope.rosterType, startPageIndex, $scope.sortBy);
            $scope.$parent.$parent.viewPage($scope.paramObject.rosterType, startPageIndex, $scope.paramObject.sortBy); 
            $scope.currentPageIndex = startPageIndex;

            $scope.startListRowIndex = ($scope.currentPageIndex - 1) * 25 + 1;
            $scope.endListRowIndex = $scope.currentPageIndex * 25;
           // $scope.nextPageSet($scope.rosterType, startPageIndex, $scope.sortBy, $scope.totalPageCount, $scope.visiblePageOptions, $scope.currentPageIndex);
            $scope.nextPageSet(startPageIndex);
        };

        //======= LISTENER
        $scope.$on('updatePagination', function (event, paramO ) {

             $scope.paramObject = paramO; 
            //console.log('@@UPDATE PAGINATION TYPE:' + $scope.paramObject.rosterType);
            //    + paramObject.startPageIndex + ' CURRENTPAGEINDEX:' + paramObject.currentPageIndex  
            //    + ' TOTAL LIST COUNT:' + paramObject.TotalListCount 
            //    + ' ROWS PER PAGE:' + paramObject.RowsPerPage);
           //$scope.nextPageSet(paramObject.rosterType, paramObject.startPageIndex, paramObject.sortBy, paramObject.totalPageCount, paramObject.visiblePageOptions, paramObject.currentPageIndex);

          //  $scope.nextPageSet($scope.paramObject);
              $scope.nextPageSet($scope.paramObject.startPageIndex);

        });

    }]);
})();
 