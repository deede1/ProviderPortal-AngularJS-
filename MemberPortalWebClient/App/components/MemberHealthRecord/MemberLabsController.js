(function () {
    'use strict';

    angular
		.module('MemberPortal')
		.controller('MemberLabsController', MemberLabsController);

    MemberLabsController.$inject = ['$scope', '$q', 'memberDataService'];

    function MemberLabsController($scope, $q, memberDataService) {

      function lab(dos,testcode,desc,result) {
          this.dos = dos;
          this.testcode = testcode;
          this.desc = desc;
          this.result = result;
      }

      $scope.Labs = [];
    

        //paging
        $scope.totalPages = 0;
        $scope.currentPage = 1;
        $scope.rowsPerPage =10;
        $scope.startItem = function (currentPage) {
            if (currentPage) {
                return (currentPage - 1) * $scope.rowsPerPage + 1;
            } else {
                return (1 - 1) * $scope.rowsPerPage + 1;
            }
        };
        $scope.endItem = function (currentPage) {
            var lastPotItem;
            if (currentPage) {
                lastPotItem = currentPage * $scope.rowsPerPage;
                if (lastPotItem > $scope.TotalListCount)
                    lastPotItem = $scope.TotalListCount;
            } else {
                lastPotItem = 1 * $scope.rowsPerPage;
                if (lastPotItem > $scope.TotalListCount)
                    lastPotItem = $scope.TotalListCount;
            }
            return lastPotItem;
        };
        //sorting
        $scope.sortCol = "admitDate";
        $scope.sortReverse = true;
        $scope.changeSort = function (colName) {
            if (colName === $scope.sortCol) {
                $scope.sortReverse = !$scope.sortReverse;
            } else {
                $scope.sortCol = colName;
                $scope.sortReverse = true;
            }

        };


    
        function GetMemberLabs(memberID) {
            $scope.Labs = [];
            var requestParam = {
                SubscriberNumber: memberID,
                IsApiPaging: false,
                PageNumber: "0",
                RowsPerPage: "10000",
                Sort: []
            };
           memberDataService.GetMemberLabs(JSON.stringify(requestParam)).success(function (data) {
               $scope.$parent.loading = false;
               if (data != null) {
                   _.each(data.List, function (l) {
                       if (l) {
                           _.each(l.Result, function(ll) {
                               $scope.Labs.push(new lab(l.DateOfService, ll.TestCode, ll.TestDescription, ll.Result));
                           });
                       }
                   });
                
                   $scope.TotalListCount = $scope.Labs.length;
                   $scope.totalPages = Math.ceil($scope.Labs.length / $scope.rowsPerPage);
                  
                
                   //format dates
                   _.each($scope.Labs, function (v) {
                       if (v.dos != null) {
                           v.dos = moment(v.dos);
                       }

                   });

            
               }

           }).error(function () {
               $scope.$parent.loading = false;
               $scope.$parent.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
           });

        
        }

        $scope.paginationLimit = function (data) {
            return $scope.rowsPerPage * $scope.currentPage;
        };

        $scope.hasMoreItemsToShow = function () {
            return $scope.currentPage < $scope.totalPages;
        };
        $scope.showMoreItems = function () {
            $scope.currentPage = $scope.currentPage + 1;
        };

        $scope.hasLessItemsToShow = function () {
            return $scope.currentPage > 1;
        };
        $scope.showLessItems = function () {
            $scope.currentPage = $scope.currentPage - 1;
        };

        GetMemberLabs($scope.$parent.IEHPID.slice(0, 12));
    }
})();