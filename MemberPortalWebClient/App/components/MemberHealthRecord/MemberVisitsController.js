(function () {
    'use strict';

    angular
		.module('MemberPortal')
		.controller('MemberVisitsController', MemberVisitsController);

    MemberVisitsController.$inject = ['$scope', '$q', 'memberDataService'];

    function MemberVisitsController($scope, $q, memberDataService) {

        //paging
        $scope.totalPages = 0;
        $scope.currentPage = 1;
        $scope.rowsPerPage = 10;
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


        function GetMemberVisits(memberID) {
            var requestParam = {
                SubscriberNumber: memberID,
                IsApiPaging: false,
                PageNumber: "0",
                RowsPerPage: "10000",
                Sort: []
            };
            memberDataService.GetMemberVisits(JSON.stringify(requestParam)).success(function (data) {
                $scope.$parent.loading = false;
                if (data != null) {
                    $scope.Visits = data.List;
                    //format dates
                    _.each($scope.Visits, function (v) {
                        if (v.admitDate != null) {
                            v.admitDate = moment(v.admitDate);
                        }
                        if (v.thruDate != null) {
                            v.thruDate = moment(v.thruDate);
                        }
                        if (v.caprimDate != null) {
                            v.caprimDate = moment(v.caprimDate);
                        }
                        if (v.dos != null) {
                            v.dos = moment(v.dos);
                        }

                    });
                    $scope.TotalListCount = data.List.length;
                    $scope.totalPages = Math.ceil(data.List.length / $scope.rowsPerPage);
                 

                } else {
                    $scope.$parent.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                }
            }).error(function () {
                $scope.$parent.loading = false;
                $scope.$parent.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
            });

        }


        $scope.paginationLimit = function () {
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


        GetMemberVisits($scope.$parent.IEHPID);


    }

})();